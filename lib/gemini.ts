import { TONE_PROMPTS } from "./constants";
import type { ToneId } from "./constants";

class GeminiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 500
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof GeminiError && error.statusCode && error.statusCode < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 200;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}

export async function generateEmailDraft(prompt: string, tone: ToneId = "professional"): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError("GEMINI_API_KEY environment variable is not configured", 500);
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const toneInstruction = TONE_PROMPTS[tone] || TONE_PROMPTS.professional;

  const systemInstruction = [
    "You are an expert business communication writer with years of experience crafting impactful emails.",
    toneInstruction,
    "Guidelines:",
    "- Write only the email body (no subject line unless specifically asked)",
    "- Use proper greeting and sign-off appropriate to the tone",
    "- Keep it concise but complete",
    "- Use clear paragraph breaks for readability",
    "- Ensure the message achieves its intended purpose effectively",
    "- Do not include any meta-commentary about the email",
  ].join("\n");

  const result = await withRetry(async () => {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemInstruction}\n\nUser's intent: ${prompt}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: tone === "professional" ? 0.5 : tone === "friendly" ? 0.8 : 0.6,
          topP: 0.9,
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "Unknown error");
      throw new GeminiError(`API request failed: ${res.status} - ${errorBody}`, res.status);
    }

    return res.json();
  });

  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError("No content generated — the model returned an empty response");
  }

  return text.trim();
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w: string) => w.length > 0).length;
}
