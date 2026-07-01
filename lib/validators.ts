import { TONES, CATEGORIES, PAGINATION } from "./constants";
import type { ToneId, CategoryId } from "./constants";

export interface DraftCreateInput {
  prompt: string;
  tone: ToneId;
  category: CategoryId;
}

export interface DraftFilterParams {
  tone?: ToneId;
  category?: CategoryId;
  favorite?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function validateDraftCreate(
  body: unknown
): { success: true; data: DraftCreateInput } | { success: false; error: string } {
  if (!body || typeof body !== "object") {
    return { success: false, error: "Request body is required" };
  }

  const { prompt, tone, category } = body as Record<string, unknown>;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return { success: false, error: "Prompt is required and must be a non-empty string" };
  }

  if (prompt.trim().length > 2000) {
    return { success: false, error: "Prompt must be under 2000 characters" };
  }

  const validTone = tone && typeof tone === "string" && TONES.some((t) => t.id === tone);
  const validCategory =
    category && typeof category === "string" && CATEGORIES.some((c) => c.id === category);

  return {
    success: true,
    data: {
      prompt: prompt.trim(),
      tone: validTone ? (tone as ToneId) : "professional",
      category: validCategory ? (category as CategoryId) : "general",
    },
  };
}

export function parseFilterParams(searchParams: URLSearchParams): DraftFilterParams {
  const tone = searchParams.get("tone");
  const category = searchParams.get("category");
  const favorite = searchParams.get("favorite");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = Math.min(
    parseInt(searchParams.get("pageSize") || String(PAGINATION.DEFAULT_PAGE_SIZE), 10),
    PAGINATION.MAX_PAGE_SIZE
  );

  return {
    ...(tone && TONES.some((t) => t.id === tone) ? { tone: tone as ToneId } : {}),
    ...(category && CATEGORIES.some((c) => c.id === category)
      ? { category: category as CategoryId }
      : {}),
    ...(favorite === "true" ? { favorite: true } : {}),
    ...(search && search.trim() ? { search: search.trim() } : {}),
    page: Math.max(1, page),
    pageSize,
  };
}
