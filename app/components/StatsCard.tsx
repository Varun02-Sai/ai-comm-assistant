"use client";

interface StatsCardProps {
  totalDrafts: number;
  favorites: number;
  totalWords: number;
}

export function StatsCard({ totalDrafts, favorites, totalWords }: StatsCardProps) {
  const stats = [
    {
      label: "Total Drafts",
      value: totalDrafts,
      icon: "📝",
      color: "var(--accent-from)",
    },
    {
      label: "Favorites",
      value: favorites,
      icon: "⭐",
      color: "#f59e0b",
    },
    {
      label: "Words Written",
      value: totalWords.toLocaleString(),
      icon: "📊",
      color: "#22c55e",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
      }}
      className="stagger-children"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card"
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "default",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: `${stat.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            {stat.icon}
          </div>
          <div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
