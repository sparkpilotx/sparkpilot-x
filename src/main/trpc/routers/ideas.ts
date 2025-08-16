import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const ideasRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.idea.findMany({ orderBy: { createdAt: 'desc' } });
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        content: z.string().max(10_000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.idea.create({ data: input });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.idea.delete({ where: { id: input.id } });
      return { ok: true } as const;
    }),
});


