// app/page.tsx
"use client";
import { useState, useEffect } from "react";

type Draft = { id: number; prompt: string; draft: string; createdAt: string };

export default function Home() {
const [prompt, setPrompt] = useState('');
const [draft, setDraft] = useState('');
const [loading, setLoading] = useState(false);
const [history, setHistory] = useState<Draft[]>([]);

const fetchHistory = async () => {
try {
const res = await fetch('/api/draft');
if (res.ok) {
setHistory(await res.json());
} else {
console.error('Failed to fetch history', await res.text());
}
} catch (err) {
console.error('Network error fetching history', err);
}
};

useEffect(() => { fetchHistory(); }, []);

const handleSubmit = async () => {
if (!prompt.trim()) return;
setLoading(true); setDraft('');
const res = await fetch('/api/draft', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ prompt })
});
const data = await res.json();
setDraft(data.draft ?? data.error);
setLoading(false);
fetchHistory();
};

return (
<main className='min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto'>
<h1 className='text-2xl font-bold text-[#1a3a5c] mb-2'>
AI Comm Assistant
</h1>
<p className='text-gray-500 mb-6 text-sm'>
AI-powered business email drafting · Next.js + TypeScript + Prisma + Gemini
</p>

<textarea
className='w-full border rounded-lg p-3 text-sm mb-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400'
placeholder='Describe your email intent (e.g. tell client meeting moved to Friday)'
value={prompt}
onChange={e => setPrompt(e.target.value)}
/>
<button
onClick={handleSubmit}
disabled={loading}
className='bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50 mb-6'
>
{loading ? 'Drafting...' : 'Generate Draft'}
</button>

{draft && (
<div className='bg-white border rounded-lg p-4 mb-6 whitespace-pre-wrap text-sm'>
{draft}
</div>
)}

{history.length > 0 && (
<div>
<h2 className='font-semibold text-gray-700 mb-2'>Recent Drafts</h2>
{history.map(d => (
<div key={d.id} className='border rounded p-3 mb-2 text-xs bg-white'>
<p className='text-gray-400 mb-1'>Intent: {d.prompt}</p>
<p className='whitespace-pre-wrap'>{d.draft}</p>
</div>
))}
</div>
)}
</main>
);
}
