# AI Infrastructure

Server-side AI infrastructure with provider abstraction, usage tracking, and entitlement-based access control.

## Overview

The AI module provides:

- Unified interface for OpenAI, Anthropic, and Google Gemini
- Server-only execution (API keys never exposed to client)
- Entitlement-based access (`ai_access`)
- Per-user rate limiting
- Usage tracking for cost monitoring
- Normalized error handling

## Supported Providers

| Provider  | Models                      | Default Model                | Token Tracking       |
| --------- | --------------------------- | ---------------------------- | -------------------- |
| OpenAI    | GPT-4o, GPT-4o-mini, etc.   | `gpt-4o-mini`                | Exact                |
| Anthropic | Claude 3.5 Sonnet, etc.     | `claude-3-5-sonnet-20241022` | Exact                |
| Gemini    | Gemini 1.5 Flash, Pro, etc. | `gemini-1.5-flash`           | Exact or estimated\* |

\*Gemini provides token counts in most responses. When unavailable, tokens are estimated (~4 chars/token).

## Quick Start

### 1. Add API Keys

Add one or more provider keys to `.env`:

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Google Gemini
GEMINI_API_KEY=AIzaSy-your-gemini-key
```

Get your API keys from:

- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys
- Gemini: https://aistudio.google.com/app/apikey

### 2. Run Database Migration

```bash
pnpm prisma db push
pnpm db:seed
```

This creates the `ai_usage` table and adds the `ai_access` entitlement.

### 3. Use the AI Client

```typescript
import { aiClient, AIError } from "@/lib/ai";

// In an API route
const response = await aiClient.generate(
  {
    prompt: "Explain quantum computing",
    maxTokens: 500,
  },
  { userId: user.id }
);

console.log(response.content);
```

## API Reference

### `aiClient.generate(request, options)`

Generate text from a prompt.

```typescript
interface AIGenerateRequest {
  prompt: string;
  systemPrompt?: string;
  provider?: "openai" | "anthropic" | "gemini";
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

const response = await aiClient.generate(
  {
    prompt: "Hello",
    provider: "openai",
    maxTokens: 100,
  },
  { userId: "user_123" }
);

// Response
{
  content: "Hi there!",
  provider: "openai",
  model: "gpt-4o-mini",
  usage: {
    promptTokens: 5,
    completionTokens: 10,
    totalTokens: 15
  }
}
```

## Switching Providers

To switch providers, pass the `provider` parameter:

```typescript
// Use OpenAI (default if configured)
await aiClient.generate({ prompt: "Hello", provider: "openai" }, { userId });

// Use Anthropic
await aiClient.generate({ prompt: "Hello", provider: "anthropic" }, { userId });

// Use Gemini
await aiClient.generate({ prompt: "Hello", provider: "gemini" }, { userId });
```

If no provider is specified, the system uses the first available in order: OpenAI → Anthropic → Gemini.

Via API:

```bash
curl -X POST /api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello", "provider": "gemini"}'
```

### `aiClient.generateStream(request, options)`

Generate text with streaming.

```typescript
const stream = aiClient.generateStream(
  { prompt: "Write a story" },
  { userId: "user_123" }
);

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
  if (chunk.done) {
    console.log("\nUsage:", chunk.usage);
  }
}
```

### `aiClient.isAIConfigured()`

Check if any provider is configured.

```typescript
if (!aiClient.isAIConfigured()) {
  return { error: "AI not available" };
}
```

### `aiClient.getAvailableProviders()`

Get list of configured providers.

```typescript
const providers = aiClient.getAvailableProviders();
// ["openai", "anthropic", "gemini"]
```

## Entitlement Check

AI access requires the `ai_access` entitlement. Check it in API routes:

```typescript
// Server-side check
import { hasEntitlement } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const hasAI = await hasEntitlement("ai_access");
  if (!hasAI) {
    return NextResponse.json(
      { error: "AI access requires Pro subscription" },
      { status: 403 }
    );
  }
  // ... continue with AI call
}
```

The `ai_access` entitlement is assigned to the Pro plan by default. Modify `prisma/seed.ts` to change this.

## Usage Tracking

All AI calls with a `userId` are automatically tracked.

### Query Usage

```typescript
import { getUserAIUsage, getUserDailyTokens } from "@/lib/ai";

// Get usage for time period
const usage = await getUserAIUsage(userId, new Date("2024-01-01"));
// {
//   totalRequests: 150,
//   totalTokens: 45000,
//   promptTokens: 15000,
//   completionTokens: 30000,
//   byProvider: {
//     openai: { requests: 100, tokens: 30000 },
//     anthropic: { requests: 50, tokens: 15000 }
//   }
// }

// Get today's token usage
const dailyTokens = await getUserDailyTokens(userId);
// 5000
```

### Database Schema

```prisma
model AiUsage {
  id               String   @id @default(cuid())
  userId           String
  provider         String   // "openai", "anthropic", "gemini"
  model            String   // "gpt-4o-mini", "claude-3-5-sonnet", etc.
  promptTokens     Int
  completionTokens Int
  totalTokens      Int

  createdAt DateTime @default(now())

  @@index([userId, createdAt])
  @@map("ai_usage")
}
```

## Rate Limiting

Default limits (configurable in `lib/ai/ai-rate-limit.ts`):

| Limit               | Value |
| ------------------- | ----- |
| Requests per minute | 10    |
| Requests per hour   | 60    |

Rate limiting is per-user, in-memory. For production with multiple instances, implement Redis-based limiting.

## Error Handling

All provider errors are normalized to `AIError`:

```typescript
import { AIError } from "@/lib/ai";

try {
  await aiClient.generate({ prompt: "..." }, { userId });
} catch (error) {
  if (error instanceof AIError) {
    // Safe message for client
    const message = error.toClientMessage();

    // Error details for logging
    console.log({
      code: error.code, // "RATE_LIMITED", "TIMEOUT", etc.
      provider: error.provider,
      retryable: error.retryable,
      statusCode: error.statusCode,
    });
  }
}
```

### Error Codes

| Code                      | Description       | Retryable |
| ------------------------- | ----------------- | --------- |
| `PROVIDER_NOT_CONFIGURED` | API key missing   | No        |
| `RATE_LIMITED`            | Too many requests | Yes       |
| `TIMEOUT`                 | Request timed out | Yes       |
| `CONTEXT_LENGTH_EXCEEDED` | Prompt too long   | No        |
| `CONTENT_FILTERED`        | Content blocked   | No        |
| `INSUFFICIENT_QUOTA`      | Billing issue     | No        |

Errors are automatically captured in Sentry (except rate limits and content filters).

## Safety Limits

Built-in limits prevent runaway costs:

| Limit                  | Value         |
| ---------------------- | ------------- |
| Max tokens per request | 4,096         |
| Max prompt length      | 100,000 chars |
| Request timeout        | 30 seconds    |

Configure in `lib/ai/ai-types.ts`:

```typescript
export const AI_LIMITS = {
  MAX_TOKENS_PER_REQUEST: 4096,
  DEFAULT_TIMEOUT_MS: 30000,
  MAX_PROMPT_LENGTH: 100000,
} as const;
```

## Adding a New Provider

1. Create `lib/ai/providers/newprovider.ts`:

```typescript
import {
  AIProviderInterface,
  AIGenerateRequest,
  AIGenerateResponse,
} from "../ai-types";

class NewProvider implements AIProviderInterface {
  readonly name = "newprovider" as const;

  isAvailable(): boolean {
    return !!process.env.NEWPROVIDER_API_KEY;
  }

  async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    // Implementation
  }
}

export const newProvider = new NewProvider();
```

2. Register in `lib/ai/ai-client.ts`:

```typescript
import { newProvider } from "./providers/newprovider";

function getProvider(name: AIProvider) {
  switch (name) {
    case "openai":
      return openaiProvider;
    case "anthropic":
      return anthropicProvider;
    case "newprovider":
      return newProvider;
  }
}
```

3. Update `AIProvider` type in `ai-types.ts`:

```typescript
export type AIProvider = "openai" | "anthropic" | "newprovider";
```

## Key Files

| File                        | Purpose                  | Editable    |
| --------------------------- | ------------------------ | ----------- |
| `/lib/ai/ai-client.ts`      | Main entry point         | 🔒 CORE     |
| `/lib/ai/ai-types.ts`       | Type definitions         | 🔒 CORE     |
| `/lib/ai/ai-errors.ts`      | Error handling           | 🔒 CORE     |
| `/lib/ai/ai-usage.ts`       | Usage tracking           | 🔒 CORE     |
| `/lib/ai/ai-rate-limit.ts`  | Rate limiting            | 🔒 CORE     |
| `/lib/ai/providers/*.ts`    | Provider implementations | 🔒 CORE     |
| `/api/ai/generate/route.ts` | Example endpoint         | 🏗️ EDITABLE |

## Example API Route

See `/app/api/ai/generate/route.ts` for a complete example with:

- Authentication
- Entitlement checking
- Input validation
- Error handling
- Usage tracking

Copy this route as a starting point for your AI features.

## Cost Management

1. **Set token limits**: Use `maxTokens` to cap response length
2. **Monitor usage**: Query `AIUsage` table regularly
3. **Entitlement gating**: Only Pro users get AI access
4. **Rate limiting**: Prevent abuse with per-user limits
5. **Track by provider**: Usage stats broken down by provider (openai, anthropic, gemini)

### Provider Cost Comparison

Costs vary significantly between providers and models. As of late 2024:

| Provider  | Model             | Input (per 1M tokens) | Output (per 1M tokens) |
| --------- | ----------------- | --------------------- | ---------------------- |
| OpenAI    | gpt-4o-mini       | ~$0.15                | ~$0.60                 |
| Anthropic | claude-3-5-sonnet | ~$3.00                | ~$15.00                |
| Gemini    | gemini-1.5-flash  | ~$0.075               | ~$0.30                 |

**Note:** Prices change frequently. Check provider pricing pages for current rates. Gemini offers a free tier with rate limits.

### Rate Limit Considerations

Each provider has its own rate limits in addition to the app's built-in limits. If you exceed provider limits, you'll receive `RATE_LIMITED` errors. Adjust your usage patterns or request limit increases from the provider.

## Provider-Specific Notes

### Gemini

- **Streaming**: Not implemented in the current version. Use non-streaming calls.
- **System prompts**: Handled via Gemini's `systemInstruction` parameter.
- **Safety filters**: Gemini has aggressive content filters. `CONTENT_FILTERED` errors are common for edge cases.
- **Token counting**: Usually exact, but estimated when metadata is unavailable.
- **Free tier**: Gemini offers a free tier with rate limits. Good for testing.

### OpenAI

- Full streaming support
- Most reliable token counting
- Widest model selection

### Anthropic

- Full streaming support
- Strong reasoning capabilities
- Higher cost per token

## Troubleshooting

### "AI service is not configured"

Add at least one API key:

```bash
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
# or
GEMINI_API_KEY=AIzaSy-...
```

### "AI access requires Pro subscription"

User needs `ai_access` entitlement. Either:

- Upgrade to Pro plan
- Add `ai_access` to their plan in the database

### Rate limit errors

Wait 60 seconds or adjust limits in `ai-rate-limit.ts`.

### Timeout errors

- Reduce `maxTokens`
- Use a faster model
- Increase timeout in `ai-types.ts`
