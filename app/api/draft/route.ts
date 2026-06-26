// app/api/draft/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { generateEmailDraft } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
try {
const { prompt } = await req.json();
if (!prompt || typeof prompt !== 'string') {
return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
}

const draft = await generateEmailDraft(prompt);

const saved = await prisma.draft.create({
data: { prompt, draft }
});

return NextResponse.json({ id: saved.id, draft });
} catch (err) {
console.error(err);
return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
}
}

export async function GET() {
try {
const drafts = await prisma.draft.findMany({
orderBy: { createdAt: 'desc' },
take: 10
});
return NextResponse.json(drafts);
} catch (err) {
console.error("GET error:", err);
return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
}
}
