### Stage 1: UI Refactor Skeleton

Status: Completed

#### Goals

-  Replace transcript with single central result view scaffold.
-  Keep existing layout components intact.
-  Wire Generate to POST to `/api/generate` and stream into `resultMarkdown`.
-  Remove transcript UI and `ActionButtons` usage from `page.tsx`.

#### Scope

-  `src/app/page.tsx`
   -  Introduce `resultMarkdown` and `isStreaming` state variables.
   -  Remove transcript/message mapping; render `<Response>` with `resultMarkdown`.
   -  Center content in a max-width container.
-  Keep `PageLayout`, `Container`, `Header`, `ContentArea`, `Footer` unchanged.

#### Steps

1. Introduce state in `page.tsx`: `resultMarkdown` and `isStreaming`.
2. Implement `generateProjectIdea` to `POST /api/generate`, read the `ReadableStream`, and append decoded chunks into `resultMarkdown`; toggle `isStreaming` during the operation.
3. Render a centered `<Response>{resultMarkdown}</Response>` area for the single result.
4. Remove `Conversation`/`Message` transcript and `ActionButtons` from `page.tsx`.

#### Acceptance Criteria

-  A single central area streams Markdown content live into view.
-  No transcript bubbles or `ActionButtons` are present anywhere.
-  Generate is disabled while `isStreaming` is true.
-  Lints/build succeed; no unused imports.
