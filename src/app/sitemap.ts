import { MetadataRoute } from "next";

const baseUrl =
  (process.env.NEXT_PUBLIC_APP_URL || "https://concier.ai").replace(/\/$/, "");

/**
 * Static routes that should be included in the sitemap
 * Add new public routes here as your application grows
 */
const staticRoutes = [
  "",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
] as const;

/**
 * Generate sitemap for public pages only
 * Excludes private/auth routes like /auth, /billing, /product, etc.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
