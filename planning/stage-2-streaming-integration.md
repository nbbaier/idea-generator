### Stage 2: Streaming Integration

#### Goals

-  Wire Generate to stream text into `resultMarkdown`.
-  Prefer direct POST to `/api/generate` and stream.

#### Scope

-  `src/app/page.tsx`
-  `src/app/api/generate/route.ts` (no changes expected)

#### Steps

1. Add a `handleGenerate` that POSTs to `/api/generate` with minimal payload. (Done)
2. Read `response.body` as `ReadableStream` and append chunks to `resultMarkdown`. (Done)
3. Toggle `isStreaming` true/false appropriately; disable Generate while true. (Done)
4. Clear previous `resultMarkdown` before starting a new generation. (Done)
5. Ensure request has `Content-Type: application/json` and flush decoder after stream end. (Done)

#### Acceptance Criteria

-  Clicking Generate streams a new idea into the central area. (Met)
-  Generate is disabled while streaming. (Met)
-  No reliance on chat transcript/history. (Met)
