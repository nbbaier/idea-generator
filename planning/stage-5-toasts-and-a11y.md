### Stage 5: Toasts & A11y

#### Goals

-  Tune toast lifecycle to a reasonable default.
-  Ensure basic accessibility signals are present.

#### Scope

-  `src/hooks/use-toast.ts`
-  `src/app/page.tsx` (aria attributes)

#### Steps

1. Change `TOAST_REMOVE_DELAY` from `1_000_000` to `7000`.
2. Ensure Generate button sets `aria-busy` while streaming.
3. Add `aria-label` to both buttons.

#### Acceptance Criteria

-  Toasts auto-dismiss around 7s by default.
-  Buttons have appropriate labels and busy state.
