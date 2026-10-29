# idea-generator

Next.js (App Router) app that streams AI-generated web-dev project ideas from OpenAI via the Vercel AI SDK. UI is `src/app/page.tsx` plus `src/components/` (shadcn/ui in `ui/`); the server side is the route handlers under `src/app/api/`. Deploys to Vercel (`vercel.json`).

- **Tooling**: Bun is the package manager (`bun install`, `bun run <script>`); the app itself runs under Next.js, so Next loads `.env.local`. Scripts live in `package.json`. There are no tests.
- **Env**: `OPENAI_API_KEY` is required; routes return 500 without it. Optional `OPENAI_MODEL`, `OPENAI_MAX_TOKENS`, `OPENAI_TEMPERATURE`, and `NEXT_PUBLIC_BASE_PATH` (read in `next.config.ts`). Any request to an API route spends real OpenAI tokens.
- **Duplicated routes**: `api/generate/route.ts` (used by the page) and `api/chat/route.ts` (unused) are near-copies; generate differs only by supplying a default prompt when `messages` is empty. A change to the prompt, rate limit, or error mapping belongs in both or neither.
- **Rate limit** is an in-memory per-IP bucket, so it resets on restart and per serverless instance.
- **Planning docs** in `docs/` are historical stage plans, not current spec.
- **Done** means `bun run check` and `bun run type-check` both pass.
