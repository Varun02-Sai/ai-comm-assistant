"use client";

import { TONES } from "@/lib/constants";
import type { ToneId } from "@/lib/constants";

interface ToneSelectorProps {
  selected: ToneId;
  onChange: (tone: ToneId) => void;
}

export function ToneSelector({ selected, onChange }: ToneSelectorProps) {
  return (
    <div>
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
        Tone
      </label>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {TONES.map((tone) => {
          const isActive = selected === tone.id;
          return (
            <button
              key={tone.id}
              onClick={() => onChange(tone.id)}
              title={tone.description}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 200ms ease",
                border: isActive
                  ? "1px solid var(--accent-from)"
                  : "1px solid var(--border-default)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))"
                  : "var(--bg-glass)",
                color: isActive ? "var(--text-accent)" : "var(--text-secondary)",
                boxShadow: isActive
                  ? "0 0 12px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "none",
              }}
            >
              <span>{tone.icon}</span>
              <span>{tone.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
