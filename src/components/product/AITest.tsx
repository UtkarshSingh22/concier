// 🏗️ USER EDITABLE — AI TEST COMPONENT
// Example / testing component — safe to remove.
// Use this to validate AI infrastructure is working correctly.
// Not a production feature, just a sanity check.

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Provider = "openai" | "anthropic" | "gemini";

interface AIResponse {
  content: string;
  provider: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export function AITest() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<Provider>("openai");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          provider,
          maxTokens: 500,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `Request failed with status ${res.status}`
        );
      }

      setResponse(data);
      toast.success("AI response generated successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card">
      <h3 className="text-sm font-medium text-card-foreground mb-1">
        AI Infrastructure Test
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Test component for validating AI calls. Safe to remove.
      </p>

      {/* Provider Selection */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Provider
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as Provider)}
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="openai">OpenAI (GPT)</option>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="gemini">Google (Gemini)</option>
        </select>
      </div>

      {/* Prompt Input */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to test AI generation..."
          disabled={isLoading}
          rows={3}
          className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim()}
        className="w-full mb-3"
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="space-y-2">
          <div className="p-3 bg-muted/50 border rounded-md">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {response.content}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded">
              Provider: {response.provider}
            </span>
            <span className="px-2 py-1 bg-muted rounded">
              Model: {response.model}
            </span>
            <span className="px-2 py-1 bg-muted rounded">
              Tokens: {response.usage.totalTokens}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
