import { createTRPCRouter, publicProcedure } from '../trpc';

export const healthRouter = createTRPCRouter({
  db: publicProcedure.query(async ({ ctx }) => {
    const start = performance.now();
    await ctx.prisma.$queryRaw`SELECT 1`;
    const durationMs = Math.round(performance.now() - start);
    return { ok: true, durationMs } as const;
  }),
});


