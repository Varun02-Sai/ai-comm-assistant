// lib/gemini.ts


export async function generateEmailDraft(prompt: string): Promise<string> {
const GEMINI_URL =
`https://generativelanguage.googleapis.com/v1beta/models/` +
`gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

const systemInstruction = "You are a professional business email writer. Given a rough intent, write a concise polished email. Output only the email body.";
const body = JSON.stringify({
contents: [{ parts: [{ text: `${systemInstruction}\n\nIntent: ${prompt}` }] }],
generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
});

let res;
for (let i = 0; i < 3; i++) {
res = await fetch(GEMINI_URL, {
method: "POST",
headers: { 'Content-Type': 'application/json' },
body
});
if (res.ok) break;
if (res.status !== 503) break; // If it's not a 503, don't retry, just fail
await new Promise(r => setTimeout(r, 1500)); // wait 1.5s before retrying
}

if (!res || !res.ok) {
const errorText = res ? await res.text() : 'No response';
throw new Error(`Gemini API error: ${res?.status} - ${errorText}`);
}
const data = await res.json();
return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';
}
