// 🔒 CORE SYSTEM - DO NOT MODIFY
// Database client setup for the SaaS boilerplate.
// This provides the Prisma client instance used throughout the application.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
