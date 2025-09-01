import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

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

function getSystemPrompt(): string {
	return `You are a creative web development project idea generator. When a user asks for a project idea, generate a creative and unique web development project concept.

Format your response exactly as follows:

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
[Beginner/Intermediate/Advanced]

Make projects innovative, practical, and inspiring. Vary the domain (e.g., productivity, entertainment, education, e-commerce, social, tools, etc.) and adjust complexity appropriately.

If the user provides specific requirements (topic, domain, difficulty), incorporate those into your response.`;
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
		let messages: Array<{ role: string; content: string }> = [];
		try {
			const body = await request.json();
			messages = body.messages || [];

			// Validate messages format
			if (!Array.isArray(messages)) {
				return new Response(
					JSON.stringify({
						error: "Invalid request body. Expected: { messages: Array }",
					}),
					{ status: 400, headers: { "Content-Type": "application/json" } },
				);
			}
		} catch (error) {
			if (error instanceof SyntaxError) {
				return new Response(
					JSON.stringify({ error: "Invalid JSON in request body" }),
					{ status: 400, headers: { "Content-Type": "application/json" } },
				);
			}
		}

		// Get environment configuration
		const config = getEnvConfig();

		if (process.env.NODE_ENV !== "production") {
			console.error(
				`API request - IP: ${clientIP}, Config: ${JSON.stringify(config)}, Messages: ${messages.length}`,
			);
		}

		// Call OpenAI with chat messages
		const result = streamText({
			model: openai(config.model),
			system: getSystemPrompt(),
			messages,
			maxOutputTokens: config.maxTokens,
			temperature: config.temperature,
		});

		return result.toTextStreamResponse();
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
