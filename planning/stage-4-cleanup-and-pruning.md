### Stage 4: Cleanup & Pruning ✅ COMPLETED

#### Goals

-  [x] Remove transcript dependencies from the main page.
-  [x] Avoid dead code usage; keep optional components for future.

#### Scope

-  `src/app/page.tsx`
-  `src/components/ActionButtons.tsx` (usage removal only)

#### Steps

1. [x] Remove `ActionButtons` usage from `page.tsx`.
2. [x] Ensure no `Conversation`/`Message` imports remain.
3. [x] Verify no unused imports or variables; fix lints.
4. [x] Optionally keep `ActionButtons` component file for future chat mode.

#### Acceptance Criteria

-  [x] No transcript-related code is referenced by `page.tsx`.
-  [x] Lints/build pass with no unused imports.

#### Completion Notes

All tasks completed successfully:

-  No `ActionButtons`, `Conversation`, or `Message` imports found in `page.tsx`
-  All imports in main page are actively used and necessary
-  Linting passes with no unused variables or imports
-  `ActionButtons.tsx` component preserved for future chat mode functionality
-  Main page now cleanly focuses on single-use project idea generation without transcript dependencies
