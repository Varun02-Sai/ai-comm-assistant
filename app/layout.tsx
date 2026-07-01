import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jurin — AI Business Communication Suite",
  description:
    "Transform rough ideas into polished professional emails instantly. Powered by advanced AI with tone customization, draft history, and smart categorization.",
  keywords: [
    "AI email writer",
    "business communication",
    "email drafting",
    "professional emails",
    "AI assistant",
  ],
  openGraph: {
    title: "Jurin — AI Business Communication Suite",
    description:
      "Transform rough ideas into polished professional emails instantly.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
