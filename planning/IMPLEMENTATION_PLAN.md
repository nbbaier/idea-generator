### Implementation Plan (Index)

-  [Stage 1: UI Refactor Skeleton](./stage-1-ui-refactor-skeleton.md)
-  [Stage 2: Streaming Integration](./stage-2-streaming-integration.md)
-  [Stage 3: Actions & Clipboard](./stage-3-actions-and-clipboard.md)
-  [Stage 4: Cleanup & Pruning](./stage-4-cleanup-and-pruning.md)
-  [Stage 5: Toasts & A11y](./stage-5-toasts-and-a11y.md)
-  [Stage 6: Build, Test, Deploy Notes](./stage-6-build-test-deploy.md)

### UI Refactor: Central Display + Generate/Copy

#### Goals

-  Replace the chat-like transcript with a single central result view.
-  Provide two clear actions: Generate Project and Copy to Markdown.
-  Preserve streaming UX and simplify state management.

#### Scope of Changes

-  `src/app/page.tsx`

   -  Maintain `resultMarkdown` string state and a simple `isStreaming` flag.
   -  Remove transcript (`Conversation`, `Message`) mapping; render a single `Response` with `resultMarkdown`.
   -  Center the result in a max-width container (`max-w-3xl mx-auto`); keep existing `PageLayout`, `Container`, `Header`, `ContentArea`, `Footer`.
   -  Actions row below the result: primary "Generate Project" and outline "Copy to Markdown".
   -  Disable Generate while streaming; disable Copy when `resultMarkdown` is empty.

-  Generation handler

   -  Option A (minimal churn): keep `useChat`, send a fixed prompt, ignore history, and on new generation clear prior `resultMarkdown`.
   -  Option B (simpler mental model): `fetch('/api/generate', { method: 'POST', body: JSON.stringify({ messages: [] }) })` and stream the response into `resultMarkdown`.

-  Clipboard & toasts

   -  Use `navigator.clipboard.writeText(resultMarkdown)` with try/catch and toasts on success/failure.
   -  Reduce `TOAST_REMOVE_DELAY` in `src/hooks/use-toast.ts` from `1_000_000` to `7000`.
   -  Add `aria-label` to both buttons; set `aria-busy` on Generate while streaming.

-  Cleanup
   -  Remove usage of `ActionButtons` in `page.tsx`. Optionally keep the component for future chat mode.
   -  Ensure no dead imports or unused chat-only components are referenced by the page.

#### Step-by-Step

1. `page.tsx`: introduce `resultMarkdown` and `isStreaming` state; remove transcript mapping.
2. Wire Generate to either `useChat` with ignored history or direct `fetch` to `/api/generate` and stream into `resultMarkdown`.
3. Add centered result area rendering `<Response>{resultMarkdown}</Response>`.
4. Add actions row with two buttons; implement copy handler with toasts.
5. Update `use-toast.ts` duration to `7000`.
6. Run lints, build, and a quick manual test for streaming and clipboard.

#### Acceptance Criteria

-  Landing view shows a single Generate button centered; after generation, a single Markdown-rendered idea appears in the central area.
-  Copy button is enabled only when content exists and places exact Markdown into the clipboard.
-  Generate is disabled during streaming and reflects loading state; Copy disabled during streaming is acceptable but optional.
-  No transcript or message bubbles are rendered anywhere in the UI.
-  Lint/build pass; no unused imports introduced.

#### Optional Enhancements (post-refactor)

-  Add optional filters (domain, difficulty) as controlled inputs above the result.
-  Provide a simple seed/variety toggle to encourage different ideas.
-  Consider a "Copy as JSON" action if moving to structured output later.
