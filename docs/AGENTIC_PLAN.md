# Making Idea-Generator Agentic

## Overview

Transform the single-turn idea generator into a multi-phase agentic system that:

1. **Researches** the landscape before generating (npm, GitHub)
2. **Refines** ideas through clarifying questions
3. **Generates** with real-time tool validation

## Unified Flow

```
User Request
     │
     ▼
┌─────────────────────────────┐
│ Phase 1: Research           │
│ • Search npm for similar    │
│ • Search GitHub projects    │
│ • Check tech trends         │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 2: Refinement         │
│ • Present research findings │
│ • Ask clarifying questions  │
│ • Gather preferences        │
└─────────────┬───────────────┘
              ▼
┌─────────────────────────────┐
│ Phase 3: Generation         │
│ • Generate unique idea      │
│ • Validate tech stack       │
│ • Output structured result  │
└─────────────────────────────┘
```

## Tools to Implement

### Research Tools

| Tool                   | API                                  | Purpose                      |
| ---------------------- | ------------------------------------ | ---------------------------- |
| `searchNpmPackages`    | `registry.npmjs.org/-/v1/search`     | Find similar packages        |
| `searchGitHubRepos`    | `api.github.com/search/repositories` | Find similar projects        |
| `getNpmPackageDetails` | `registry.npmjs.org/<pkg>`           | Get version/compatibility    |
| `getTechTrends`        | Curated data                         | Current tech recommendations |

### Example Tool Definition

```typescript
const searchNpmPackages = tool({
   description: "Search npm for packages matching a query",
   parameters: z.object({
      query: z.string(),
      limit: z.number().optional().default(10),
   }),
   execute: async ({ query, limit }) => {
      const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.objects.map((obj: any) => ({
         name: obj.package.name,
         description: obj.package.description,
         downloads: obj.downloads?.all,
      }));
   },
});
```

## Files to Create/Modify

### New Files

```
src/
├── app/
│   └── api/
│       └── agent/route.ts       # Main agentic endpoint
├── components/
│   └── agent/
│       ├── AgentConversation.tsx
│       ├── PhaseIndicator.tsx
│       ├── ToolCallDisplay.tsx
│       └── UserInputArea.tsx
├── hooks/
│   └── use-agent-chat.ts        # Client-side state management
└── lib/
    └── tools/
        ├── index.ts             # Tool exports
        ├── npm-tools.ts         # npm API tools
        └── github-tools.ts      # GitHub API tools
```

### Modify Existing

- `src/types/index.ts` - Add AgentPhase, ToolCall, ResearchData types
- `src/app/page.tsx` - Add toggle between simple/agent mode

## API Route: `/api/agent/route.ts`

```typescript
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
   searchNpmPackages,
   searchGitHubRepos,
   getNpmPackageDetails,
   getTechTrends,
} from "@/lib/tools";

const systemPrompt = `You are an intelligent project idea generator with research capabilities.

Process:
1. RESEARCH: Use tools to search npm and GitHub for similar projects
2. REFINE: Ask 2-3 clarifying questions based on findings
3. GENERATE: Create a unique, validated idea

Always explain research findings before asking questions.`;

export async function POST(request: Request) {
   const { messages } = await request.json();

   const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      tools: {
         searchNpmPackages,
         searchGitHubRepos,
         getNpmPackageDetails,
         getTechTrends,
      },
      maxSteps: 10,
   });

   return result.toDataStreamResponse();
}
```

## Client Hook: `use-agent-chat.ts`

```typescript
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

type AgentPhase =
   | "idle"
   | "researching"
   | "refining"
   | "generating"
   | "complete";

export function useAgentChat() {
   const [phase, setPhase] = useState<AgentPhase>("idle");
   const [toolCalls, setToolCalls] = useState<ToolCall[]>([]);

   const chat = useChat({
      api: "/api/agent",
      onToolCall: ({ toolCall }) => {
         setToolCalls((prev) => [...prev, toolCall]);
      },
   });

   const startAgent = () => {
      setPhase("researching");
      chat.append({
         role: "user",
         content: "Generate a creative web development project idea",
      });
   };

   return { ...chat, phase, toolCalls, startAgent };
}
```

## Implementation Order

### Step 1: Tools Foundation

- Create `src/lib/tools/` directory
- Implement `searchNpmPackages` and `searchGitHubRepos`
- Add types to `src/types/index.ts`

### Step 2: Agent API Route

- Create `/api/agent/route.ts`
- Configure system prompt for multi-phase behavior
- Wire up tools with `maxSteps: 10`

### Step 3: Client State

- Create `use-agent-chat.ts` hook
- Track phase transitions and tool calls

### Step 4: UI Components

- `PhaseIndicator` - Shows research → refine → generate
- `ToolCallDisplay` - Sidebar showing tool activity
- `AgentConversation` - Chat with inline tool results

### Step 5: Integration

- Add mode toggle to main page
- Keep existing simple mode as fallback

## Verification Plan

1. **Tool Testing**: Call each tool independently via the API
2. **Flow Testing**: Complete a full research → refine → generate cycle
3. **Error Handling**: Test with rate limits, network failures
4. **UI Testing**: Verify phase indicators update correctly
5. **Run `bun test`** for any new unit tests
