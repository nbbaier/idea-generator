### Stage 3: Actions & Clipboard

#### Goals

-  Provide Generate and Copy actions beneath the result area.
-  Maintain a simple, accessible actions row.

#### Scope

-  `src/app/page.tsx`
-  `src/components/response.tsx` (display only)

#### Steps

1. Add an actions row with two buttons: primary Generate, outline Copy to Markdown. (Done)
2. Disable Generate while `isStreaming`; disable Copy when `resultMarkdown` is empty. (Done)
3. Implement copy with `navigator.clipboard.writeText(resultMarkdown)` and toast feedback. (Done)
4. Add `aria-label` for both buttons; set `aria-busy` on Generate while streaming. (Done)
5. Update `TOAST_REMOVE_DELAY` in `src/hooks/use-toast.ts` from 1,000,000 to 7000. (Done)

#### Acceptance Criteria

-  Buttons appear centered under the result area and behave as specified. (Met)
-  Copy places exact Markdown to clipboard; success/failure toasts appear. (Met)
