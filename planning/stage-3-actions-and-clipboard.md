### Stage 3: Actions & Clipboard

#### Goals

- Provide Generate and Copy actions beneath the result area.
- Maintain a simple, accessible actions row.

#### Scope

- `src/app/page.tsx`
- `src/components/response.tsx` (display only)

#### Steps

1. Add an actions row with two buttons: primary Generate, outline Copy to Markdown.
2. Disable Generate while `isStreaming`; disable Copy when `resultMarkdown` is empty.
3. Implement copy with `navigator.clipboard.writeText(resultMarkdown)` and toast feedback.
4. Add `aria-label` for both buttons; set `aria-busy` on Generate while streaming.

#### Acceptance Criteria

- Buttons appear centered under the result area and behave as specified.
- Copy places exact Markdown to clipboard; success/failure toasts appear.


