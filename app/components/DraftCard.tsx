"use client";

import { useState } from "react";
import { TONES, CATEGORIES } from "@/lib/constants";

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

interface DraftCardProps {
  draft: Draft;
  onToggleFavorite: (id: number, isFavorite: boolean) => void;
  onDelete: (id: number) => void;
  onCopy: (text: string) => void;
  index: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function DraftCard({
  draft,
  onToggleFavorite,
  onDelete,
  onCopy,
  index,
}: DraftCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const tone = TONES.find((t) => t.id === draft.tone);
  const category = CATEGORIES.find((c) => c.id === draft.category);

  const previewText =
    draft.draft.length > 180 ? draft.draft.slice(0, 180) + "…" : draft.draft;

  return (
    <div
      className="glass-card"
      style={{
        padding: "20px",
        animationDelay: `${index * 60}ms`,
        animation: "fadeInUp 0.4s ease-out both",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-accent)",
              fontWeight: 600,
              marginBottom: 4,
              lineHeight: 1.4,
            }}
          >
            &ldquo;{draft.prompt}&rdquo;
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tone && (
              <span className="badge" style={{ color: "var(--text-accent)" }}>
                {tone.icon} {tone.label}
              </span>
            )}
            {category && (
              <span className="badge" style={{ color: "var(--text-secondary)" }}>
                {category.icon} {category.label}
              </span>
            )}
            <span
              className="badge"
              style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
            >
              {draft.wordCount} words
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {timeAgo(draft.createdAt)}
        </span>
      </div>

      {/* Draft content */}
      <div
        style={{
          fontSize: "0.85rem",
          lineHeight: 1.7,
          color: "var(--text-secondary)",
          whiteSpace: "pre-wrap",
          marginBottom: 16,
          cursor: draft.draft.length > 180 ? "pointer" : "default",
        }}
        onClick={() => draft.draft.length > 180 && setExpanded((e) => !e)}
      >
        {expanded ? draft.draft : previewText}
        {draft.draft.length > 180 && (
          <span
            style={{
              color: "var(--text-accent)",
              fontSize: "0.75rem",
              marginLeft: 4,
              fontWeight: 500,
            }}
          >
            {expanded ? " ▲ Show less" : " ▼ Show more"}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="btn-ghost"
          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
          onClick={() => onCopy(draft.draft)}
        >
          📋 Copy
        </button>
        <button
          className="btn-ghost"
          style={{
            padding: "6px 12px",
            fontSize: "0.75rem",
            borderColor: draft.isFavorite
              ? "rgba(245, 158, 11, 0.3)"
              : undefined,
            color: draft.isFavorite ? "#f59e0b" : undefined,
          }}
          onClick={() => onToggleFavorite(draft.id, !draft.isFavorite)}
        >
          {draft.isFavorite ? "★ Favorited" : "☆ Favorite"}
        </button>
        {!confirmDelete ? (
          <button
            className="btn-ghost"
            style={{
              padding: "6px 12px",
              fontSize: "0.75rem",
              marginLeft: "auto",
            }}
            onClick={() => setConfirmDelete(true)}
          >
            🗑️ Delete
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginLeft: "auto",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.7rem", color: "var(--error)" }}>
              Sure?
            </span>
            <button
              className="btn-ghost"
              style={{
                padding: "4px 10px",
                fontSize: "0.7rem",
                borderColor: "rgba(239,68,68,0.3)",
                color: "var(--error)",
              }}
              onClick={() => {
                onDelete(draft.id);
                setConfirmDelete(false);
              }}
            >
              Yes
            </button>
            <button
              className="btn-ghost"
              style={{ padding: "4px 10px", fontSize: "0.7rem" }}
              onClick={() => setConfirmDelete(false)}
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
