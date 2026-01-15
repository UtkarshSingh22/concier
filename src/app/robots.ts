import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

/**
 * Generate robots.txt configuration
 * Allows indexing of public pages, disallows private/auth routes
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing"],
      disallow: ["/auth", "/billing", "/product", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
