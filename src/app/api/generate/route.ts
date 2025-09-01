import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST() {
	if (!process.env.OPENAI_API_KEY) {
		return new Response("OpenAI API key not configured", { status: 500 });
	}
	const prompt = `Generate a creative and unique web development project idea. The response should be formatted exactly as follows:

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

Make it innovative, practical, and inspiring. Vary the complexity and domain (e.g., productivity, entertainment, education, e-commerce, social, tools, etc.).`;

	const result = streamText({
		model: openai("gpt-3.5-turbo"),
		prompt,
		maxOutputTokens: 500,
		temperature: 0.9,
	});

	return result.toUIMessageStreamResponse();
}
