### Stage 5: Deployment vs static export

Todos:

-  [ ] Decide hosting mode: static-only vs Node/edge runtime.
-  [ ] If static-only, move `/api/generate` to a serverless/edge function and set `NEXT_PUBLIC_API_URL` then call absolute URL from client.
-  [ ] If runtime available, remove `output: "export"` from `next.config.ts` to keep API routes working.
-  [ ] Verify `basePath` handling for both app and API; add E2E smoke test URL using `basePath`.
