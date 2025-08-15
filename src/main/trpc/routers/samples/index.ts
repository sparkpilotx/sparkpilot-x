import { helloQueryRouter } from './hello-query';
import { helloMutationRouter } from './hello-mutation';
import { helloSubscriptionRouter } from './hello-subscription';
import { createTRPCRouter } from '../../trpc';

export const samplesRouter = createTRPCRouter({
  helloQuery: helloQueryRouter,
  helloMutation: helloMutationRouter,
  helloSubscription: helloSubscriptionRouter,
});
