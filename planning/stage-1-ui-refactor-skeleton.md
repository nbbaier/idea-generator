### Stage 1: UI Refactor Skeleton

#### Goals

-  Replace transcript with single central result view scaffold.
-  Keep existing layout components intact.

#### Scope

-  `src/app/page.tsx`
   -  Introduce `resultMarkdown` and `isStreaming` state variables.
   -  Remove transcript/message mapping; render `<Response>` with `resultMarkdown`.
   -  Center content in a max-width container.
-  Keep `PageLayout`, `Container`, `Header`, `ContentArea`, `Footer` unchanged.

#### Steps

1. Create state in `page.tsx`: `const [resultMarkdown, setResultMarkdown] = useState(""); const [isStreaming, setIsStreaming] = useState(false);`
2. Remove `Conversation`/`Message` render; place `<Response>{resultMarkdown}</Response>` in central area.
3. Ensure initial empty state renders a friendly CTA area.

#### Acceptance Criteria

-  The page renders a single central area that will hold Markdown.
-  No transcript bubbles are present anywhere.
-  Lints/build succeed; no unused imports.
