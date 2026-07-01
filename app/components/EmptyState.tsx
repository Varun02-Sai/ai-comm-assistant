"use client";

export function EmptyState() {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      {/* SVG Illustration */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        style={{ marginBottom: 24, opacity: 0.5 }}
      >
        {/* Envelope body */}
        <rect
          x="15"
          y="35"
          width="90"
          height="60"
          rx="6"
          fill="var(--bg-tertiary)"
          stroke="var(--border-default)"
          strokeWidth="1.5"
        />
        {/* Envelope flap */}
        <path
          d="M15 41 L60 70 L105 41"
          stroke="var(--accent-from)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        {/* Sparkle 1 */}
        <circle cx="90" cy="28" r="2" fill="var(--accent-via)" opacity="0.6">
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Sparkle 2 */}
        <circle cx="30" cy="30" r="1.5" fill="var(--accent-to)" opacity="0.4">
          <animate
            attributeName="opacity"
            values="0.4;0.8;0.4"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Sparkle 3 */}
        <circle cx="75" cy="22" r="1" fill="var(--accent-from)" opacity="0.5">
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Lines representing text */}
        <rect
          x="30"
          y="55"
          width="40"
          height="3"
          rx="1.5"
          fill="var(--border-default)"
          opacity="0.5"
        />
        <rect
          x="30"
          y="63"
          width="60"
          height="3"
          rx="1.5"
          fill="var(--border-default)"
          opacity="0.3"
        />
        <rect
          x="30"
          y="71"
          width="50"
          height="3"
          rx="1.5"
          fill="var(--border-default)"
          opacity="0.2"
        />
      </svg>

      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--text-secondary)",
          marginBottom: 8,
        }}
      >
        No drafts yet
      </h3>
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          maxWidth: 300,
          lineHeight: 1.6,
        }}
      >
        Describe your email intent above and let Jurin craft the perfect message
        for you.
      </p>
    </div>
  );
}
