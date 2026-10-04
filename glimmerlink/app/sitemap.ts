import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/config";

// Surprise pages (/s/...) are private and must never be listed here.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/create"].map((p) => ({ url: `${BRAND.siteUrl}${p}`, lastModified: new Date() }));
}
