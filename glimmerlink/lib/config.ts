// Change the brand in ONE place. Everything else reads from here.
export const BRAND = {
  name: "Glimmerlink",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  linkLifetimeHours: 48,
} as const;

export const STORAGE_BUCKET = "surprise-media";
