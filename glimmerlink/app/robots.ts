import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/s/", "/api/"] },
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
  };
}
