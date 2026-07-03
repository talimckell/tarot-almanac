// Prisma 7: the CLI (migrate, studio, etc.) reads its connection URL from here, not from
// schema.prisma. The app's runtime PrismaClient is configured separately in lib/prisma.ts
// via a driver adapter — this file is CLI-only.
// Prisma's config loader doesn't auto-load .env before evaluating this file, so load it
// explicitly (Next.js itself auto-loads .env/.env.local at runtime; this is CLI-only).
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
