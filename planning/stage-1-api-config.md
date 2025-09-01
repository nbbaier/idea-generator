### Stage 1: API configurability and resilience

Todos:

-  [x] Add env variables to `.env.example`: `OPENAI_MODEL`, `OPENAI_MAX_TOKENS`, `OPENAI_TEMPERATURE`.
-  [x] In `src/app/api/generate/route.ts`, read envs with defaults (model=`gpt-4o-mini`, tokens=`500`, temp=`0.9`).
-  [x] Validate env parsing (number bounds for tokens/temp). Fall back to defaults on invalid values.
-  [x] Accept optional input via JSON body: `{ topic?: string, domain?: string, difficulty?: DifficultyLevel }`.
-  [x] Validate request body (type guards or zod). On invalid input, return 400 with details.
-  [x] Integrate input into prompt sections (title/description/features/stack/complexity).
-  [x] Implement basic rate limiting per IP (e.g., token bucket in memory). Return 429 when exceeded.
-  [x] Add try/catch around `streamText`; map provider errors to 502/503 with safe message.
-  [x] Log minimal diagnostics (no PII) with `console.error` behind `NODE_ENV !== 'production'` guard.

**Status: ✅ COMPLETED**

All API configurability and resilience features have been successfully implemented. The API now supports:

-  Environment-based configuration with validation
-  Optional request parameters (topic, domain, difficulty)
-  Rate limiting per IP address
-  Comprehensive error handling with proper HTTP status codes
-  Development logging without PII
