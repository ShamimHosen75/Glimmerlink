import type { ThemeId } from "./themes";

// What the recipient's browser receives. Never includes storage paths or internal fields.
export type PublicSurprise = {
  recipientName: string;
  senderName: string;
  message: string;
  theme: ThemeId;
  candleCount: number;
  wishes: string[];
  photoUrl: string | null;
  voiceUrl: string | null;
  expiresAt: string;
};
