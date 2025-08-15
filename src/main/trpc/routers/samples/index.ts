import { helloQueryRouter } from './hello-query';
import { createTRPCRouter } from '../../trpc';

export const samplesRouter = createTRPCRouter({
  helloQuery: helloQueryRouter,
});
