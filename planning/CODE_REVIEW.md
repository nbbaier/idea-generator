### Code Review & Refactor Plan: bolt-idea-gen

This review builds on `planning/CODE_REVIEW.md` and focuses on refactoring the chat-like interface into a simpler UI with a central display area, a Generate button, and a Copy-to-Markdown button. It also revisits robustness, a11y, and deployment.

## Current State (as of this review)

-  **UI flow**
   -  `src/app/page.tsx` uses `useChat` from `@ai-sdk/react` and renders a chat-like transcript with `Conversation`, `Message`, and `Response` (Streamdown) components.
   -  When there are no messages, it shows a centered CTA with a single "Generate Project Idea" button. After generation, it switches to a chat transcript view with action buttons below.
   -  `ActionButtons` includes: Copy to Markdown, Regenerate, and New Idea. Copy reads the last assistant message text parts, writes to clipboard, and toasts on success/failure.
-  **API**
   -  `src/app/api/generate/route.ts` and `src/app/api/chat/route.ts` both implement streaming with `ai` + `@ai-sdk/openai` and include simple token-bucket rate limiting, env-driven config for model/tokens/temperature, and a structured system prompt returning Markdown.
-  **Rendering**
   -  Responses are rendered via `Streamdown` (`src/components/response.tsx`), which is simpler than a custom parser and likely robust for Markdown-like content.
-  **Layouts/components**
   -  `PageLayout`, `Container`, `Header`, `ContentArea`, `Footer` provide a simple page scaffold. Tailwind utility classes are used throughout.
-  **Toasts**
   -  `src/hooks/use-toast.ts` sets `TOAST_REMOVE_DELAY = 1_000_000` (≈16m), which is too long for typical notifications.
-  **Next config**
   -  `output: "export"` with `distDir: ./dist`. If the app relies on API routes at runtime, pure static export will not host them; ensure deployment provides a runtime for `/api/*`.

## Gaps vs Desired Simpler Interface

-  The transcript/chat metaphor adds complexity. For the requested UX, we only need:
   -  **Central display area** that shows the latest generated project idea in Markdown.
   -  **Generate button** to request a new idea.
   -  **Copy button** to copy the rendered Markdown of the current idea.
-  Secondary actions (e.g., Regenerate vs New Idea) are redundant in a single-result interface and can be collapsed into a single Generate/Regenerate action.

## Recommendations

### 1) UI Refactor to Single-View Result

-  Replace the chat transcript with a single central result view:
   -  Keep `PageLayout`, `Container`, `Header`, `ContentArea`, `Footer`.
   -  In `page.tsx`, track only the latest assistant text as `resultMarkdown` and streaming state.
   -  Render `Response` with `resultMarkdown` inside a centered, max-width container.
-  Simplify actions:
   -  Replace `ActionButtons` usage with two primary buttons aligned center: "Generate Project" and "Copy to Markdown".
   -  Disable Copy when empty; show a toast if there’s no result.
-  Keep loading/streaming feedback:
   -  Disable Generate while `status === 'submitted' | 'streaming'`.
   -  Optionally add a lightweight skeleton or spinner in the central area.

### 2) Keep Streaming, Drop Transcript

-  Continue using `useChat` to leverage existing `/api/chat` or `/api/generate` streaming. However, only display the concatenated text from the latest assistant message.
-  Alternatively, call `/api/generate` directly with a minimal request and stream text into `resultMarkdown`. This removes the concept of a message history entirely.

### 3) Clipboard and A11y

-  Ensure both buttons have `aria-label` and set `aria-busy` on Generate during streaming.
-  Keep the toast UX but reduce the auto-dismiss delay.

### 4) Toast Lifecycle Tuning

-  Reduce `TOAST_REMOVE_DELAY` from `1_000_000` to `5_000–10_000` and allow per-toast overrides if needed.

### 5) Deployment Considerations

-  If deploying as a static export, ensure API routes are hosted elsewhere (edge/functions) or remove `output: "export"` if a Node/Bun runtime is available.
-  Add a brief README note clarifying how `/api/*` is hosted in the chosen environment.

## Concrete Change List

-  `src/app/page.tsx`
   -  Replace chat transcript with a single `resultMarkdown` state string.
   -  Buttons: "Generate Project" (primary) and "Copy to Markdown" (outline).
   -  Wire Generate to POST to `/api/generate` (or keep `useChat` but ignore past messages) and stream text into `resultMarkdown`.
   -  Disable Generate while streaming and show simple loading text/state.
-  `src/components/ActionButtons.tsx`
   -  Option A: Remove usage from `page.tsx` and keep component around for potential future chat mode.
   -  Option B: Replace with a simpler `ResultActions` component with just Generate/Copy.
-  `src/hooks/use-toast.ts`
   -  Change `TOAST_REMOVE_DELAY` to `7000` (or similar reasonable default).
-  `src/app/api/*`
   -  Keep existing `/api/generate` behavior; no change required for the simpler UI. Optionally remove `/api/chat` if unused.
-  `next.config.ts`
   -  Verify deployment target. If hosting API with Next runtime, remove `output: "export"`.

## Suggested Implementation Notes

-  Streaming without chat state:
   -  Use `fetch('/api/generate', { method: 'POST', body: JSON.stringify({ messages: [] }) })` and consume the ReadableStream to append into `resultMarkdown`.
   -  Or keep `useChat` but only render the last assistant message’s text (already partially implemented today), and clear old messages on new generation to mimic a single-result interface.
-  Markdown rendering:
   -  `Streamdown` is sufficient; no need to introduce another renderer unless specific Markdown edge cases arise.

## Quick Wins

-  Reduce toast duration.
-  Remove transcript container and map logic from `page.tsx`.
-  Keep a single primary CTA and a copy action in view at all times.

## Risks

-  Removing transcript means no history; ensure this matches the product intent.
-  If static export is kept without an external API host, generation will fail in production.

## Follow-up Enhancements (Optional)

-  Allow optional filters (domain/difficulty) as controlled inputs above the central display.
-  Add a small counter or seed to encourage variety.
-  Provide a "Copy as JSON" option if later moving to structured output.
