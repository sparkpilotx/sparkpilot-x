import { samplesRouter } from './routers/samples';
import { healthRouter } from './routers/health';
import { createTRPCRouter } from './trpc';
import { ideasRouter } from './routers/ideas';

export const appRouter = createTRPCRouter({
  samples: samplesRouter,
  health: healthRouter,
  ideas: ideasRouter,
});

export type AppRouter = typeof appRouter;
