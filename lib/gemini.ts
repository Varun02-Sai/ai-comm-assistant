// lib/gemini.ts


export async function generateEmailDraft(prompt: string): Promise<string> {
const GEMINI_URL =
`https://generativelanguage.googleapis.com/v1beta/models/` +
`gemini-flash-lite-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

const systemInstruction = "You are a professional business email writer. Given a rough intent, write a concise polished email. Output only the email body.";
const body = JSON.stringify({
contents: [{ parts: [{ text: `${systemInstruction}\n\nIntent: ${prompt}` }] }],
generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
});

let res;
for (let i = 0; i < 2; i++) { // only retry once
res = await fetch(GEMINI_URL, {
method: "POST",
headers: { 'Content-Type': 'application/json' },
body
});
if (res.ok) break;
if (res.status !== 503) break;
if (i === 0) await new Promise(r => setTimeout(r, 500)); // fast retry delay
}

if (!res || !res.ok) {
const errorText = res ? await res.text() : 'No response';
throw new Error(`Gemini API error: ${res?.status} - ${errorText}`);
}
const data = await res.json();
return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';
}
