### Code Review: bolt-idea-gen

This review focuses on maintainability, performance, and deployment robustness. Items are ordered by impact vs. effort.

## High Priority

-  **Use environment-safe model defaults**: In `src/app/api/generate/route.ts`, the model is `openai("gpt-3.5-turbo")` and `maxOutputTokens: 500`. Consider externalizing `MODEL_NAME`, `MAX_TOKENS`, and `TEMPERATURE` to env vars with sane defaults. Also consider upgrading to `gpt-4o-mini` (or a cost-effective reasoning model) for better output quality vs. cost. Add input validation and rate limiting.
-  **Streaming UX consistency**: `page.tsx` sets `isStreaming={isLoading}`. Replace with proper streaming detection from the AI SDK if available, or track when `completion` changes length during stream. Otherwise, the typing cursor may show at the wrong times.
-  **Custom Markdown rendering is brittle**: `ProjectIdeaDisplay` implements a manual Markdown parser. Replace with a robust renderer like `react-markdown` plus `rehype-raw`/`remark-gfm` as needed, and sanitize if any user input can flow through. This reduces maintenance risk and improves accuracy for edge cases (nested lists, code blocks, emphasis).
-  **Clipboarding fallback and accessibility**: `ActionButtons` uses `navigator.clipboard`; add fallback for insecure contexts and set `aria-busy` when generating. Ensure buttons have clear `aria-label`s.
-  **Toast lifecycle**: `use-toast.ts` sets `TOAST_REMOVE_DELAY = 1_000_000`. This keeps toasts around for ~16m, potentially cluttering UI and memory. Use a smaller delay (e.g., 5_000–10_000) and allow override per toast.

## Medium Priority

-  **Type alignment with prompt format**: `src/types/index.ts` defines `ProjectIdea`, but UI displays raw markdown. Consider returning structured JSON from the API and rendering with components. This enables richer UI, testing, and accessibility. Alternatively, keep Markdown but remove the unused `ProjectIdea` type.
-  **API input handling**: The API ignores user input and generates a generic idea. Allow optional query/body parameters (e.g., domain, difficulty) with validation. Add simple abuse/rate limiting middleware.
-  **Error handling and user messaging**: Centralize error messages; in `page.tsx` the `onError` surface is good, but also handle empty or malformed responses gracefully. Add retry CTA.
-  **Next export and basePath**: `next.config.ts` uses `output: "export"`, `images.unoptimized: true`, and `trailingSlash: true`. Verify that dynamic streaming on `/api/generate` is supported by the target hosting; static export doesn’t host Node runtime. If deploying purely static, proxy the API to an edge/function host. If using a Node runtime, consider removing `output: "export"`.
-  **Tailwind v4 base styles**: `src/index.css` contains opinionated base styles (buttons, links) that may conflict with shadcn/ui tokens. Consider scoping or removing Vite-like defaults to reduce style conflicts.
-  **Button variants and semantics**: Ensure buttons with `variant="outline"` use accessible contrast against background. Add `type="button"` where buttons live inside forms.

## Low Priority

-  **Minor render perf**: In `ProjectIdeaDisplay`, skeleton list items use `key={Math.random()}`. Use stable keys (e.g., index) for predictable reconciliation; performance impact is small but deterministic keys are best practice.
-  **ClassName composition**: Several layout components build class strings manually. Prefer the existing `cn` helper to merge classes and reduce duplication.
-  **Strictness and TS config**: You already use `strict: true`. Consider narrowing `allowJs: true` if not needed, and raising `target` from `es5` to a modern target since Next compiles for you (e.g., `es2022`) to improve DX and emitted types.
-  **Dependencies**: If you adopt `react-markdown`, add it explicitly and keep bundle size in check. Tailwind v4 is in use; verify no leftover v3 config. Remove unused `tailwindcss-animate` utilities if not used.
-  **Accessibility**: Ensure headings hierarchy from the Markdown result starts with a single `h1` per page. Add `lang` and consider theme support toggling if dark variables are present.

## Suggested Edits (summarized)

1. Improve API configurability and resilience:

-  Make model, tokens, temperature env-driven
-  Add input params, validation, and basic rate limiting

2. Replace custom Markdown parser with a library:

-  Use `react-markdown` and sanitize output
-  Add list/heading/code styles via Tailwind prose

3. Align streaming indicators:

-  Track streaming state accurately instead of reusing `isLoading`

4. Tidy toasts and UX:

-  Reduce auto-dismiss delay and allow overrides
-  Ensure buttons have `aria-*` attributes and clear labels

5. Verify deployment strategy vs. Next export:

-  If API needs a runtime, avoid `output: export`; or host API separately

6. TSConfig modernize:

-  Raise `target` and remove `allowJs` if not needed

These changes will improve maintainability, correctness, and performance with minimal risk.
