import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    datasourceUrl: process.env.POSTGRES_URL_NON_POOLING,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function disconnect() {
  await prisma.$disconnect();
}
