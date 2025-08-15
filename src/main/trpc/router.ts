import { samplesRouter } from './routers/samples';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  samples: samplesRouter,
});

export type AppRouter = typeof appRouter;
