export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generateEmailDraft, countWords } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { validateDraftCreate, parseFilterParams } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateDraftCreate(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { prompt, tone, category } = validation.data;
    const draft = await generateEmailDraft(prompt, tone);
    const wordCount = countWords(draft);

    const saved = await prisma.draft.create({
      data: { prompt, draft, tone, category, wordCount },
    });

    return NextResponse.json({
      id: saved.id,
      draft: saved.draft,
      tone: saved.tone,
      category: saved.category,
      wordCount: saved.wordCount,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error("POST /api/draft error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = (err as { statusCode?: number })?.statusCode || 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = parseFilterParams(req.nextUrl.searchParams);

    const where: Record<string, unknown> = {};

    if (params.tone) where.tone = params.tone;
    if (params.category) where.category = params.category;
    if (params.favorite) where.isFavorite = true;
    if (params.search) {
      where.OR = [
        { prompt: { contains: params.search } },
        { draft: { contains: params.search } },
      ];
    }

    const [drafts, totalCount, favoriteCount, totalWordCount] = await Promise.all([
      prisma.draft.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: ((params.page || 1) - 1) * (params.pageSize || 20),
        take: params.pageSize || 20,
      }),
      prisma.draft.count(),
      prisma.draft.count({ where: { isFavorite: true } }),
      prisma.draft.aggregate({ _sum: { wordCount: true } }),
    ]);

    return NextResponse.json({
      drafts,
      meta: {
        total: totalCount,
        favorites: favoriteCount,
        totalWords: totalWordCount._sum.wordCount || 0,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
      },
    });
  } catch (err) {
    console.error("GET /api/draft error:", err);
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, isFavorite } = await req.json();

    if (!id || typeof id !== "number") {
      return NextResponse.json({ error: "Valid draft ID is required" }, { status: 400 });
    }

    const updated = await prisma.draft.update({
      where: { id },
      data: { isFavorite: Boolean(isFavorite) },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/draft error:", err);
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== "number") {
      return NextResponse.json({ error: "Valid draft ID is required" }, { status: 400 });
    }

    await prisma.draft.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/draft error:", err);
    return NextResponse.json({ error: "Failed to delete draft" }, { status: 500 });
  }
}
