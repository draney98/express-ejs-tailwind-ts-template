import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaSingleton: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prismaSingleton ||
  new PrismaClient({
    log: ['error', 'warn']
  });

if (process.env.NODE_ENV !== 'production') {
  global.prismaSingleton = prisma;
}


