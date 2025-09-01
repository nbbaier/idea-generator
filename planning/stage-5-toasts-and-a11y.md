### Stage 5: Toasts & A11y

#### Goals

-  Tune toast lifecycle to a reasonable default.
-  Ensure basic accessibility signals are present.

#### Scope

-  `src/hooks/use-toast.ts`
-  `src/app/page.tsx` (aria attributes)

#### Steps

1. [x] Change `TOAST_REMOVE_DELAY` from `1_000_000` to `7000`.
2. [x] Ensure Generate button sets `aria-busy` while streaming.
3. [x] Add `aria-label` to both buttons.

#### Acceptance Criteria

-  [x] Toasts auto-dismiss around 7s by default.
-  [x] Buttons have appropriate labels and busy state.

#### Status: ✅ COMPLETED

All accessibility improvements have been implemented:

-  Toast duration properly set to 7 seconds in `src/hooks/use-toast.ts`
-  Generate button has `aria-busy` attribute that reflects streaming state
-  Both buttons have descriptive `aria-label` attributes for screen readers
