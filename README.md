# Jurin — AI Business Communication Suite

Transform rough ideas into polished professional emails instantly. Built with Next.js, TypeScript, Prisma, and Google Gemini.

## ✨ Features

- **Smart Email Drafting** — Describe your intent in plain language, get a polished email
- **Tone Customization** — Professional, Friendly, Urgent, Persuasive, or Apologetic
- **Category Tagging** — Organize drafts by Meeting, Follow-up, Proposal, and more
- **Draft History** — Searchable, filterable archive of all generated emails
- **Favorites** — Star important drafts for quick access
- **Analytics Dashboard** — Track total drafts, favorites, and words written
- **Copy to Clipboard** — One-click copy for instant use
- **Keyboard Shortcuts** — Ctrl+Enter to generate
- **Dark Mode UI** — Premium glassmorphic design with smooth animations

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Custom Design System |
| Database | SQLite via Prisma ORM |
| AI | Google Gemini 2.0 Flash |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/jurin.git
cd jurin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Initialize the database
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
jurin/
├── app/
│   ├── api/draft/          # REST API (POST, GET, PATCH, DELETE)
│   ├── components/         # React components
│   │   ├── DraftCard.tsx   # Draft history card
│   │   ├── EmptyState.tsx  # Empty state illustration
│   │   ├── StatsCard.tsx   # Analytics dashboard
│   │   ├── Toast.tsx       # Notification system
│   │   └── ToneSelector.tsx # Tone picker
│   ├── globals.css         # Design system & animations
│   ├── layout.tsx          # Root layout with SEO
│   └── page.tsx            # Main application
├── lib/
│   ├── constants.ts        # App configuration
│   ├── gemini.ts           # Gemini API client
│   ├── prisma.ts           # Database client
│   └── validators.ts       # Input validation
├── prisma/
│   └── schema.prisma       # Database schema
└── .env.example            # Environment template
```

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/draft` | Generate a new email draft |
| `GET` | `/api/draft` | Fetch drafts with filters/pagination |
| `PATCH` | `/api/draft` | Toggle draft favorite status |
| `DELETE` | `/api/draft` | Delete a draft |

### Query Parameters (GET)

- `search` — Full-text search across prompts and drafts
- `tone` — Filter by tone (professional, friendly, urgent, etc.)
- `favorite` — Show only favorites (`true`)
- `page` / `pageSize` — Pagination

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set `GEMINI_API_KEY` and `DATABASE_URL` in environment variables
4. Deploy

### Self-hosted

```bash
npm run build
npm start
```

## 📄 License

MIT
