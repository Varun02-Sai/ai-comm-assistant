export const APP_NAME = "Jurin";
export const APP_TAGLINE = "AI-Powered Business Communication Suite";

export const TONES = [
  { id: "professional", label: "Professional", icon: "💼", description: "Polished & corporate" },
  { id: "friendly", label: "Friendly", icon: "😊", description: "Warm & approachable" },
  { id: "urgent", label: "Urgent", icon: "⚡", description: "Direct & time-sensitive" },
  { id: "persuasive", label: "Persuasive", icon: "🎯", description: "Compelling & convincing" },
  { id: "apologetic", label: "Apologetic", icon: "🙏", description: "Sincere & empathetic" },
] as const;

export const CATEGORIES = [
  { id: "general", label: "General", icon: "📧" },
  { id: "meeting", label: "Meeting", icon: "📅" },
  { id: "follow-up", label: "Follow-up", icon: "🔄" },
  { id: "proposal", label: "Proposal", icon: "📋" },
  { id: "introduction", label: "Introduction", icon: "👋" },
  { id: "thank-you", label: "Thank You", icon: "🙏" },
  { id: "announcement", label: "Announcement", icon: "📢" },
] as const;

export type ToneId = (typeof TONES)[number]["id"];
export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const TONE_PROMPTS: Record<ToneId, string> = {
  professional:
    "Write in a highly professional, corporate tone. Use formal language, structured paragraphs, and maintain a business-appropriate register throughout.",
  friendly:
    "Write in a warm, friendly, and approachable tone. Use conversational language while remaining respectful and professional. Feel personable and genuine.",
  urgent:
    "Write with urgency and directness. Get to the point quickly, use action-oriented language, and clearly convey time sensitivity without being rude.",
  persuasive:
    "Write persuasively with compelling arguments. Use confident language, highlight benefits, and create a clear call-to-action. Be convincing yet respectful.",
  apologetic:
    "Write with genuine sincerity and empathy. Acknowledge the issue clearly, take responsibility where appropriate, and propose concrete solutions.",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
