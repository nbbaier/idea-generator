### Stage 4: Toast lifecycle and accessibility

Todos:

-  [ ] In `src/hooks/use-toast.ts`, set `TOAST_REMOVE_DELAY=7000` default.
-  [ ] Allow override per toast via `duration?: number` prop stored in state.
-  [ ] Add `aria-live="polite"` to the toast container if not already present via Radix.
-  [ ] In `ActionButtons.tsx`, add `aria-label` to buttons; set `aria-busy` during generate.
-  [ ] Replace `key={Math.random()}` skeleton keys with deterministic indexes.


