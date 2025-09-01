### Stage 6: Build, Test, Deploy Notes

#### Goals

-  Validate the refactor with lints/build and a quick manual stream test.
-  Clarify deployment implications for `/api/*` with static export.

#### Scope

-  `next.config.ts`
-  `README.md`

#### Steps

1. Run lints and build; fix any issues.
2. Manual test: Generate and Copy flows.
3. Verify `output: "export"` vs API hosting; if APIs need runtime, document hosting approach or adjust config.
4. Add a README note on how `/api/*` is served in production.

#### Acceptance Criteria

-  Build passes; streaming works in dev.
-  README documents deployment approach for API routes.
