import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Since Prisma 7, the runtime client takes a driver adapter rather than reading a
// connection string from schema.prisma. Uses the pooled connection (DATABASE_URL);
// migrations use the direct one (DIRECT_URL, see prisma.config.ts).
//
// Standard Next.js singleton: in dev, hot reload would otherwise re-run this module and
// open a fresh connection pool on every edit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
