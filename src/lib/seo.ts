import type { Metadata } from "next";

export type OpenGraphType =
  | "article"
  | "website"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    type?: OpenGraphType;
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
    site?: string;
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

export interface SEODefaults {
  siteName: string;
  title: {
    default: string;
    template: string;
  };
  description: string;
  url: string;
  ogImage: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  twitter: {
    handle: string;
    site: string;
    cardType: "summary" | "summary_large_image";
  };
}

/**
 * Default SEO configuration - customize these values for your application
 */
/**
 * Default SEO configuration - customize these values for your application
 *
 * @customize Change siteName, description, and social handles to match your brand
 */
export const seoDefaults: SEODefaults = {
  siteName: process.env.NEXT_PUBLIC_APP_NAME || "Concier",
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || "Concier",
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || "Concier"}`,
  },
  description:
    "Your website's AI salesperson. Concier speaks first — at the right moment, with the right message. Join the waitlist.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: {
    url: "/opengraph-image", // Generated dynamically via app/opengraph-image.tsx
    width: 1200,
    height: 630,
    alt: process.env.NEXT_PUBLIC_APP_NAME || "Concier",
  },
  twitter: {
    handle: "@concier",
    site: "@concier",
    cardType: "summary_large_image",
  },
};

/**
 * Generate canonical URL for the current page
 */
export function generateCanonicalUrl(pathname?: string): string {
  const baseUrl = seoDefaults.url.replace(/\/$/, ""); // Remove trailing slash
  const path = pathname ? pathname.replace(/^\//, "") : ""; // Remove leading slash
  return path ? `${baseUrl}/${path}` : baseUrl;
}

/**
 * Generate complete metadata object for Next.js App Router
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = seoDefaults.description,
    keywords,
    canonical,
    noindex = false,
    nofollow = false,
    openGraph,
    twitter,
    alternates,
  } = config;

  // Generate title
  const pageTitle = title || seoDefaults.title.default;
  const fullTitle = title
    ? seoDefaults.title.template.replace("%s", title)
    : pageTitle;

  // Generate canonical URL
  const canonicalUrl = canonical || generateCanonicalUrl();

  // Base metadata
  const metadata: Metadata = {
    metadataBase: new URL(seoDefaults.url),
    title: fullTitle,
    description,
    keywords: keywords?.join(", "),
    alternates: {
      canonical: canonicalUrl,
      ...alternates,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  // Open Graph metadata
  metadata.openGraph = {
    title: openGraph?.title || fullTitle,
    description: openGraph?.description || description,
    url: openGraph?.url || canonicalUrl,
    siteName: openGraph?.siteName || seoDefaults.siteName,
    images: openGraph?.images || [
      {
        url: seoDefaults.ogImage.url,
        width: seoDefaults.ogImage.width,
        height: seoDefaults.ogImage.height,
        alt: seoDefaults.ogImage.alt,
      },
    ],
    locale: openGraph?.locale || "en_US",
    type: openGraph?.type || "website",
  };

  // Twitter Card metadata
  metadata.twitter = {
    card: twitter?.card || seoDefaults.twitter.cardType,
    title: twitter?.title || fullTitle,
    description: twitter?.description || description,
    images: twitter?.images || [seoDefaults.ogImage.url],
    creator: twitter?.creator || seoDefaults.twitter.handle,
    site: twitter?.site || seoDefaults.twitter.site,
  };

  return metadata;
}

/**
 * Helper function to create page-specific metadata with minimal configuration
 */
export function createPageMetadata(
  title: string,
  description?: string,
  overrides: Partial<SEOConfig> = {}
): Metadata {
  return generateMetadata({
    title,
    description: description || seoDefaults.description,
    ...overrides,
  });
}

/**
 * Helper function for homepage metadata
 */
export function createHomeMetadata(
  overrides: Partial<SEOConfig> = {}
): Metadata {
  return generateMetadata({
    // Don't pass title for homepage - it should use the default without template
    description: seoDefaults.description,
    ...overrides,
  });
}

/**
 * Helper function for static page metadata (pricing, about, etc.)
 */
export function createStaticPageMetadata(
  pageName: string,
  description?: string,
  overrides: Partial<SEOConfig> = {}
): Metadata {
  return generateMetadata({
    title: pageName,
    description: description || `${pageName} - ${seoDefaults.siteName}`,
    ...overrides,
  });
}
