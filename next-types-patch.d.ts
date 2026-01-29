/**
 * Patch for Next.js typegen: generated code imports from "next/types.js"
 * but that module is a runtime stub. Re-export types from "next" so TypeScript resolves correctly.
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
  } from "next";
}
