// Client-safe constants shared by the builder, the API and the 3D scene.
export const THEMES = {
  dusk: {
    label: "Lantern dusk",
    bg: "#2A1838",
    balloons: ["#F6C453", "#F7A8C4", "#8FE3C9", "#B79CFF", "#FF8A7A"],
    cake: "#F3D9B1",
    frosting: "#F7A8C4",
    candle: "#8FE3C9",
    plate: "#FFF6EC",
  },
  garden: {
    label: "Garden mint",
    bg: "#123B36",
    balloons: ["#FFD166", "#FF9AA2", "#C7F9CC", "#FFFFFF", "#F4A261"],
    cake: "#FBE7C6",
    frosting: "#8FE3C9",
    candle: "#FF9AA2",
    plate: "#F1FAEE",
  },
  sunrise: {
    label: "Peach sunrise",
    bg: "#5A2340",
    balloons: ["#FFB4A2", "#FFE066", "#9ADCFF", "#E5989B", "#FFFFFF"],
    cake: "#6B4226",
    frosting: "#FFE066",
    candle: "#9ADCFF",
    plate: "#FFF1E6",
  },
} as const;

export type ThemeId = keyof typeof THEMES;
export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export const LIMITS = {
  name: 40,
  message: 1000,
  wishes: 8,
  wish: 60,
  minCandles: 1,
  maxCandles: 9,
  // Keep photo + voice under Vercel's 4.5 MB request limit.
  photoBytes: 2.5 * 1024 * 1024,
  voiceBytes: 1.5 * 1024 * 1024,
  voiceSeconds: 60,
} as const;

export const DEFAULT_WISHES = [
  "A year full of good surprises",
  "Cake for breakfast",
  "A trip somewhere new",
  "Laughing until it hurts",
];
