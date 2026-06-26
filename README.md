# ai-comm-assistant
A minimal AI-powered business communication assistant built with the T3-adjacent stack.
Demonstrates full-stack product thinking with LLM integration.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (SQLite)
- Google Gemini 1.5 Flash API

## What it does
User types a rough email intent (e.g. 'reschedule meeting to Friday').
The app calls Gemini to generate a polished business email draft.
Draft history is stored in SQLite via Prisma and displayed in the UI.

## Run locally
```
npm install
cp .env.example .env.local # add GEMINI_API_KEY
npx prisma migrate dev --name init
npm run dev
```

## Motivation
Built to demonstrate T3 stack proficiency
and LLM-in-product integration. Directly mirrors core AI products:
automating business communications with AI agents.
