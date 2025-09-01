import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { GenerateRequest } from "@/types";

export const maxDuration = 30;

// Rate limiting: Simple in-memory token bucket per IP
const rateLimitMap = new Map<string, { tokens: number; lastRefill: number }>();
const RATE_LIMIT_TOKENS = 10;

const RATE_LIMIT_REFILL_RATE = 1; // tokens per second

function getClientIP(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	const realIP = request.headers.get("x-real-ip");
	return forwarded?.split(",")[0] || realIP || "unknown";
}

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const bucket = rateLimitMap.get(ip) || {
		tokens: RATE_LIMIT_TOKENS,
		lastRefill: now,
	};

	// Refill tokens based on time elapsed
	const timePassed = now - bucket.lastRefill;
	const tokensToAdd = Math.floor(timePassed / 1000) * RATE_LIMIT_REFILL_RATE;
	bucket.tokens = Math.min(RATE_LIMIT_TOKENS, bucket.tokens + tokensToAdd);
	bucket.lastRefill = now;

	if (bucket.tokens > 0) {
		bucket.tokens--;
		rateLimitMap.set(ip, bucket);
		return true;
	}

	rateLimitMap.set(ip, bucket);
	return false;
}

function getEnvConfig() {
	const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

	// Parse and validate max tokens
	let maxTokens = 500;
	const tokensEnv = process.env.OPENAI_MAX_TOKENS;
	if (tokensEnv) {
		const parsed = parseInt(tokensEnv, 10);
		if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 4000) {
			maxTokens = parsed;
		} else if (process.env.NODE_ENV !== "production") {
			console.error(
				`Invalid OPENAI_MAX_TOKENS: ${tokensEnv}, using default: ${maxTokens}`,
			);
		}
	}

	// Parse and validate temperature
	let temperature = 0.9;
	const tempEnv = process.env.OPENAI_TEMPERATURE;
	if (tempEnv) {
		const parsed = parseFloat(tempEnv);
		if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 2) {
			temperature = parsed;
		} else if (process.env.NODE_ENV !== "production") {
			console.error(
				`Invalid OPENAI_TEMPERATURE: ${tempEnv}, using default: ${temperature}`,
			);
		}
	}

	return { model, maxTokens, temperature };
}

function validateRequestBody(body: unknown): GenerateRequest | null {
	if (!body || typeof body !== "object") {
		return {};
	}

	const req = body as Record<string, unknown>;
	const result: GenerateRequest = {};

	// Validate topic
	if (req.topic !== undefined) {
		if (typeof req.topic === "string" && req.topic.trim().length > 0) {
			result.topic = req.topic.trim();
		} else {
			return null;
		}
	}

	// Validate domain
	if (req.domain !== undefined) {
		if (typeof req.domain === "string" && req.domain.trim().length > 0) {
			result.domain = req.domain.trim();
		} else {
			return null;
		}
	}

	// Validate difficulty
	if (req.difficulty !== undefined) {
		if (
			["Beginner", "Intermediate", "Advanced"].includes(
				req.difficulty as string,
			)
		) {
			result.difficulty = req.difficulty as
				| "Beginner"
				| "Intermediate"
				| "Advanced";
		} else {
			return null;
		}
	}

	return result;
}

function generatePrompt(params: GenerateRequest): string {
	const intro =
		"Generate a creative and unique web development project idea" +
		(params.topic ? ` related to ${params.topic}` : "") +
		(params.domain ? ` in the ${params.domain} domain` : "") +
		". The response should be formatted exactly as follows:";

	const header = [
		intro,
		`
# [Project Title]

## Description
[A compelling 2-3 sentence description of the project]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]
- [Feature 5]

## Tech Stack
- [Technology 1]
- [Technology 2]
- [Technology 3]
- [Technology 4]

## Complexity Level
`,
	];

	const complexity = params.difficulty
		? [
				`${params.difficulty}`,
				"",
				`Make sure the project is appropriate for ${params.difficulty} level developers.`,
			]
		: [
				"[Beginner/Intermediate/Advanced]",
				"",
				"Vary the complexity appropriately.",
			];

	const tail =
		" Make it innovative, practical, and inspiring." +
		(!params.domain
			? " Vary the domain (e.g., productivity, entertainment, education, e-commerce, social, tools, etc.)."
			: "");

	return [...header, ...complexity].join("\n") + tail;
}

export async function POST(request: Request) {
	const startTime = Date.now();

	try {
		// Check API key
		if (!process.env.OPENAI_API_KEY) {
			if (process.env.NODE_ENV !== "production") {
				console.error("OpenAI API key not configured");
			}
			return new Response(
				JSON.stringify({ error: "Service configuration error" }),
				{ status: 500, headers: { "Content-Type": "application/json" } },
			);
		}

		// Rate limiting
		const clientIP = getClientIP(request);
		if (!checkRateLimit(clientIP)) {
			if (process.env.NODE_ENV !== "production") {
				console.error(`Rate limit exceeded for IP: ${clientIP}`);
			}
			return new Response(
				JSON.stringify({
					error: "Rate limit exceeded. Please try again later.",
				}),
				{ status: 429, headers: { "Content-Type": "application/json" } },
			);
		}

		// Parse and validate request body
		let requestBody: GenerateRequest = {};
		try {
			const body = await request.json();
			const validated = validateRequestBody(body);
			if (validated === null) {
				return new Response(
					JSON.stringify({
						error:
							"Invalid request body. Expected: { topic?: string, domain?: string, difficulty?: 'Beginner'|'Intermediate'|'Advanced' }",
					}),
					{ status: 400, headers: { "Content-Type": "application/json" } },
				);
			}
			requestBody = validated;
		} catch (error) {
			// Empty body is acceptable, continue with defaults
			if (error instanceof SyntaxError) {
				return new Response(
					JSON.stringify({ error: "Invalid JSON in request body" }),
					{ status: 400, headers: { "Content-Type": "application/json" } },
				);
			}
		}

		// Get environment configuration
		const config = getEnvConfig();

		// Generate prompt
		const prompt = generatePrompt(requestBody);

		if (process.env.NODE_ENV !== "production") {
			console.error(
				`API request - IP: ${clientIP}, Config: ${JSON.stringify(config)}, Params: ${JSON.stringify(requestBody)}`,
			);
		}

		// Call OpenAI
		const result = streamText({
			model: openai(config.model),
			prompt,
			maxOutputTokens: config.maxTokens,
			temperature: config.temperature,
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		const duration = Date.now() - startTime;

		if (process.env.NODE_ENV !== "production") {
			console.error(`API error after ${duration}ms:`, error);
		}

		// Map different error types to appropriate HTTP status codes
		if (error && typeof error === "object" && "name" in error) {
			// OpenAI API errors
			if (
				error.name === "APIConnectionError" ||
				error.name === "APIConnectionTimeoutError"
			) {
				return new Response(
					JSON.stringify({
						error: "Service temporarily unavailable. Please try again.",
					}),
					{ status: 503, headers: { "Content-Type": "application/json" } },
				);
			}

			if (error.name === "APIError" || error.name === "AuthenticationError") {
				return new Response(
					JSON.stringify({ error: "Service configuration error" }),
					{ status: 502, headers: { "Content-Type": "application/json" } },
				);
			}
		}

		// Generic error
		return new Response(
			JSON.stringify({
				error: "An unexpected error occurred. Please try again.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
}
