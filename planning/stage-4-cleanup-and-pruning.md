### Stage 4: Cleanup & Pruning

#### Goals

- Remove transcript dependencies from the main page.
- Avoid dead code usage; keep optional components for future.

#### Scope

- `src/app/page.tsx`
- `src/components/ActionButtons.tsx` (usage removal only)

#### Steps

1. Remove `ActionButtons` usage from `page.tsx`.
2. Ensure no `Conversation`/`Message` imports remain.
3. Verify no unused imports or variables; fix lints.
4. Optionally keep `ActionButtons` component file for future chat mode.

#### Acceptance Criteria

- No transcript-related code is referenced by `page.tsx`.
- Lints/build pass with no unused imports.


