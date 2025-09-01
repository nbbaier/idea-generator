### Stage 1: API configurability and resilience

Todos:

-  [ ] Add env variables to `.env.example`: `OPENAI_MODEL`, `OPENAI_MAX_TOKENS`, `OPENAI_TEMPERATURE`.
-  [ ] In `src/app/api/generate/route.ts`, read envs with defaults (model=`gpt-4o-mini`, tokens=`500`, temp=`0.9`).
-  [ ] Validate env parsing (number bounds for tokens/temp). Fall back to defaults on invalid values.
-  [ ] Accept optional input via JSON body: `{ topic?: string, domain?: string, difficulty?: 'Beginner'|'Intermediate'|'Advanced' }`.
-  [ ] Validate request body (type guards or zod). On invalid input, return 400 with details.
-  [ ] Integrate input into prompt sections (title/description/features/stack/complexity).
-  [ ] Implement basic rate limiting per IP (e.g., token bucket in memory). Return 429 when exceeded.
-  [ ] Add try/catch around `streamText`; map provider errors to 502/503 with safe message.
-  [ ] Log minimal diagnostics (no PII) with `console.error` behind `NODE_ENV !== 'production'` guard.
