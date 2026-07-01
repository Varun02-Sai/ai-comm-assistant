"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CATEGORIES, TONES } from "@/lib/constants";
import type { ToneId, CategoryId } from "@/lib/constants";
import { ToastProvider, useToast } from "./components/Toast";
import { StatsCard } from "./components/StatsCard";
import { ToneSelector } from "./components/ToneSelector";
import { DraftCard } from "./components/DraftCard";
import { EmptyState } from "./components/EmptyState";

interface Draft {
  id: number;
  prompt: string;
  draft: string;
  tone: string;
  category: string;
  isFavorite: boolean;
  wordCount: number;
  createdAt: string;
}

interface Meta {
  total: number;
  favorites: number;
  totalWords: number;
  page: number;
  pageSize: number;
}

function HomeContent() {
  const { showToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compose state
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
  const [category, setCategory] = useState<CategoryId>("general");
  const [loading, setLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);

  // History state
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    favorites: 0,
    totalWords: 0,
    page: 1,
    pageSize: 20,
  });
  const [historyLoading, setHistoryLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTone, setFilterTone] = useState<string>("");
  const [filterFavorite, setFilterFavorite] = useState(false);

  // Fetch drafts
  const fetchDrafts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (filterTone) params.set("tone", filterTone);
      if (filterFavorite) params.set("favorite", "true");

      const res = await fetch(`/api/draft?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDrafts(data.drafts);
        setMeta(data.meta);
      }
    } catch (err) {
      console.error("Failed to fetch drafts:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [searchQuery, filterTone, filterFavorite]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  // Generate draft
  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setGeneratedDraft(null);

    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to generate draft", "error");
        return;
      }

      setGeneratedDraft(data.draft);
      showToast("Draft generated successfully!");
      setPrompt("");
      fetchDrafts();
    } catch {
      showToast("Network error — please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
    try {
      const res = await fetch("/api/draft", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFavorite }),
      });

      if (res.ok) {
        showToast(isFavorite ? "Added to favorites" : "Removed from favorites");
        fetchDrafts();
      }
    } catch {
      showToast("Failed to update", "error");
    }
  };

  // Delete draft
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/draft", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        showToast("Draft deleted");
        fetchDrafts();
      }
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  // Copy to clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    } catch {
      showToast("Failed to copy", "error");
    }
  };

  // Keyboard shortcut: Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* ========== HEADER ========== */}
        <header
          className="animate-fade-in-up"
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                background:
                  "linear-gradient(135deg, var(--accent-from), var(--accent-to))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              }}
            >
              ✉️
            </div>
            <h1
              className="gradient-text"
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Jurin
            </h1>
          </div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              fontWeight: 400,
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Transform rough ideas into polished professional emails.
            <br />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                opacity: 0.7,
              }}
            >
              Next.js · TypeScript · Prisma · Gemini
            </span>
          </p>
        </header>

        {/* ========== STATS ========== */}
        {meta.total > 0 && (
          <div style={{ marginBottom: 28 }} className="animate-fade-in-up">
            <StatsCard
              totalDrafts={meta.total}
              favorites={meta.favorites}
              totalWords={meta.totalWords}
            />
          </div>
        )}

        {/* ========== COMPOSE SECTION ========== */}
        <section
          className="glass-card animate-fade-in-up"
          style={{
            padding: "28px",
            marginBottom: 28,
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Compose
            </h2>
            <span
              className="badge"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                color: "var(--text-accent)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              ⚡ AI-Powered
            </span>
          </div>

          {/* Tone Selector */}
          <div style={{ marginBottom: 16 }}>
            <ToneSelector selected={tone} onChange={setTone} />
          </div>

          {/* Category Selector */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
                display: "block",
              }}
            >
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="glass-input"
              style={{
                padding: "10px 14px",
                fontSize: "0.85rem",
                width: "100%",
                maxWidth: 260,
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394a3b8' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt textarea */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <textarea
              ref={textareaRef}
              className="glass-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your email intent… (e.g. 'tell the client our meeting is rescheduled to Friday 3PM')"
              maxLength={2000}
              style={{
                width: "100%",
                height: 120,
                padding: "14px 16px",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 14,
                fontSize: "0.7rem",
                color:
                  prompt.length > 1800
                    ? "var(--warning)"
                    : "var(--text-muted)",
                opacity: prompt.length > 0 ? 1 : 0,
                transition: "opacity 200ms",
              }}
            >
              {prompt.length}/2000
            </div>
          </div>

          {/* Submit button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                padding: "12px 28px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Generating…</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate Draft</span>
                </>
              )}
            </button>
            <span
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                opacity: 0.6,
              }}
            >
              Ctrl + Enter
            </span>
          </div>
        </section>

        {/* ========== GENERATED OUTPUT ========== */}
        {generatedDraft && (
          <section
            className="glass-card animate-scale-in"
            style={{
              padding: "24px",
              marginBottom: 28,
              borderColor: "var(--border-accent)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Generated Draft
                </h2>
                <span
                  className="badge"
                  style={{ color: "var(--success)", background: "var(--success-bg)" }}
                >
                  ✓ Ready
                </span>
              </div>
              <button
                className="btn-ghost"
                style={{ padding: "6px 14px", fontSize: "0.75rem" }}
                onClick={() => handleCopy(generatedDraft)}
              >
                📋 Copy
              </button>
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                fontFamily: "var(--font-mono), monospace",
                padding: "16px 20px",
                background: "var(--bg-glass)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {generatedDraft}
            </div>
          </section>
        )}

        {/* ========== HISTORY SECTION ========== */}
        <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Draft History
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {/* Search */}
              <input
                type="text"
                className="glass-input"
                placeholder="Search drafts…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  width: 180,
                }}
              />
              {/* Filter: Tone */}
              <select
                className="glass-input"
                value={filterTone}
                onChange={(e) => setFilterTone(e.target.value)}
                style={{
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  appearance: "none",
                  width: 130,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394a3b8' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option value="">All Tones</option>
                {TONES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
              {/* Filter: Favorites */}
              <button
                className="btn-ghost"
                style={{
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  borderColor: filterFavorite
                    ? "rgba(245, 158, 11, 0.3)"
                    : undefined,
                  color: filterFavorite ? "#f59e0b" : undefined,
                  background: filterFavorite
                    ? "rgba(245, 158, 11, 0.05)"
                    : undefined,
                }}
                onClick={() => setFilterFavorite((f) => !f)}
              >
                {filterFavorite ? "★ Favorites" : "☆ Favorites"}
              </button>
            </div>
          </div>

          {/* Loading shimmer */}
          {historyLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="shimmer-loading"
                  style={{ height: 120, borderRadius: "var(--radius-lg)" }}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!historyLoading && drafts.length === 0 && <EmptyState />}

          {/* Draft list */}
          {!historyLoading && drafts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {drafts.map((d, i) => (
                <DraftCard
                  key={d.id}
                  draft={d}
                  index={i}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </section>

        {/* ========== FOOTER ========== */}
        <footer
          style={{
            textAlign: "center",
            marginTop: 60,
            paddingBottom: 20,
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            opacity: 0.5,
          }}
        >
          Jurin — Built with Next.js, TypeScript, Prisma & Gemini
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}
