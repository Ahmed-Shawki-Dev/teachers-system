import { PrismaClient } from '@prisma/client'

declare global {
  var Prisma: PrismaClient | undefined
}

export const Prisma =
  global.Prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') global.Prisma = Prisma
