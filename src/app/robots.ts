import { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://concier.ai";

/**
 * Generate robots.txt configuration
 * Allows indexing of public pages, disallows private/auth routes
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/contact", "/privacy", "/terms"],
      disallow: ["/auth", "/billing", "/product", "/api/"],
    },
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
