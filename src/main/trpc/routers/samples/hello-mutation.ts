import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../../trpc';

/**
 * Hello Mutation Router - Sample router demonstrating basic tRPC v11 mutation procedures.
 * 
 * This router showcases:
 * - Input validation with Zod schemas
 * - Type-safe mutation procedures
 * - Simple server-side state for demo purposes
 */
let currentStatus: 'idle' | 'processing' | 'done' = 'idle';
let additionCounter = 0;

export const helloMutationRouter = createTRPCRouter({
  /**
   * Reverse a string with basic validation.
   */
  reverseText: publicProcedure
    .input(
      z.object({
        text: z
          .string()
          .min(1, 'Text must be at least 1 character long')
          .max(200, 'Text must be less than 200 characters'),
      })
    )
    .mutation(async ({ input }) => {
      const reversed = input.text.split('').reverse().join('');
      return {
        original: input.text,
        reversed,
        length: input.text.length,
        timestamp: new Date(),
      };
    }),

  /**
   * Add two numbers and increment an internal counter.
   */
  addNumbers: publicProcedure
    .input(
      z.object({
        a: z.number(),
        b: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      additionCounter += 1;
      return {
        sum: input.a + input.b,
        a: input.a,
        b: input.b,
        operations: additionCounter,
        timestamp: new Date(),
      };
    }),

  /**
   * Set a demo status on the server module state.
   */
  setStatus: publicProcedure
    .input(
      z.object({
        status: z.enum(['idle', 'processing', 'done']),
      })
    )
    .mutation(async ({ input }) => {
      const previous = currentStatus;
      currentStatus = input.status;
      return {
        previous,
        current: currentStatus,
        changed: previous !== currentStatus,
        timestamp: new Date(),
      };
    }),
});


