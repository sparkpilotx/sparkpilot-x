import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../../trpc';

/**
 * Hello Subscription Router - Sample router demonstrating tRPC v11 subscriptions (SSE).
 * Uses the async generator form to avoid deprecated observable-based subscriptions.
 */
export const helloSubscriptionRouter = createTRPCRouter({
  /**
   * Ticker stream that emits the current time at a given interval.
   */
  ticker: publicProcedure
    .input(
      z
        .object({ intervalMs: z.number().min(250).max(5000).optional() })
        .optional()
    )
    .subscription(async function* ({ input, signal }) {
      const intervalMs = input?.intervalMs ?? 1000;
      const isAborted = (): boolean => Boolean(signal?.aborted);
      let tick = 0;
      while (!isAborted()) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        if (isAborted()) break;
        tick += 1;
        const now = new Date();
        yield { now, iso: now.toISOString(), tick } as const;
      }
    }),

  /**
   * Random number stream emitting a value between 0 and 1 at a given interval.
   */
  randomNumber: publicProcedure
    .input(
      z
        .object({ intervalMs: z.number().min(100).max(5000).optional() })
        .optional()
    )
    .subscription(async function* ({ input, signal }) {
      const intervalMs = input?.intervalMs ?? 750;
      const isAborted = (): boolean => Boolean(signal?.aborted);
      while (!isAborted()) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        if (isAborted()) break;
        yield { value: Math.random(), timestamp: new Date() } as const;
      }
    }),

  /**
   * Echo stream that repeats the provided text a certain number of times.
   */
  echo: publicProcedure
    .input(
      z.object({
        text: z.string().min(1, 'Text is required'),
        times: z.number().min(1).max(20).optional(),
        intervalMs: z.number().min(100).max(2000).optional(),
      })
    )
    .subscription(async function* ({ input, signal }) {
      const intervalMs = input.intervalMs ?? 500;
      const times = input.times ?? 5;
      const isAborted = (): boolean => Boolean(signal?.aborted);
      for (let index = 1; index <= times; index += 1) {
        if (isAborted()) break;
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        if (isAborted()) break;
        yield { index, text: input.text, timestamp: new Date() } as const;
      }
    }),
});


