/**
 * Patch for Next.js type resolution at build time.
 * - "next/types.js" is a runtime stub; re-export types so typegen resolves.
 * - "next" sometimes doesn't expose Metadata etc.; re-export from internal types.
 */
declare module "next/types.js" {
  export type {
    Metadata,
    ResolvedMetadata,
    ResolvingMetadata,
    Viewport,
    ResolvedViewport,
    ResolvingViewport,
    MetadataRoute,
  } from "next/dist/lib/metadata/types/metadata-interface";
}

declare module "next" {
  export type {
    Metadata,
    ResolvedMetadata,
    ResolvingMetadata,
    Viewport,
    ResolvedViewport,
    ResolvingViewport,
    MetadataRoute,
  } from "next/dist/lib/metadata/types/metadata-interface";
}
