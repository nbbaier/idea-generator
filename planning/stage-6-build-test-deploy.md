### Stage 6: Build, Test, Deploy Notes

#### Goals

-  Validate the refactor with lints/build and a quick manual stream test.
-  Clarify deployment implications for `/api/*` with static export.

#### Scope

-  `next.config.ts`
-  `README.md`

#### Steps

1. [x] Run lints and build; fix any issues.
2. [x] Manual test: Generate and Copy flows.
3. [x] Verify `output: "export"` vs API hosting; if APIs need runtime, document hosting approach or adjust config.
4. [x] Add a README note on how `/api/*` is served in production.

#### Acceptance Criteria

-  [x] Build passes; streaming works in dev.
-  [x] README documents deployment approach for API routes.

#### Status: ✅ COMPLETED

All build and deployment issues have been resolved:

-  Fixed lint issues (unused variables, import types)
-  Resolved type errors in API routes (ModelMessage → CoreMessage)
-  Removed conflicting `output: "export"` config to support API routes
-  Updated README with Next.js deployment instructions and platform recommendations
-  Verified build passes and application works in development
