import { PrismaClient } from '@prisma/client';

// Maintain a single PrismaClient instance across hot reloads in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: { url: import.meta.env.MAIN_VITE_POSTGRES_URL },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function ensureDatabaseConnection(): Promise<void> {
  // Lightweight health check using a simple query
  await prisma.$queryRaw`SELECT 1`;
}


