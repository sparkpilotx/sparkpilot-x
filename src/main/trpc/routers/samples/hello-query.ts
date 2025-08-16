
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../../trpc';

/**
 * Hello Query Router - Sample router demonstrating basic tRPC v11 query procedures.
 * 
 * This router showcases:
 * - Input validation with Zod schemas
 * - Type-safe query procedures
 * - Error handling and response formatting
 * - Basic tRPC v11 patterns for Electron applications
 */
export const helloQueryRouter = createTRPCRouter({
  /**
   * Simple hello query that returns a greeting message.
   * 
   * This procedure demonstrates a basic query without input parameters,
   * useful for testing the tRPC setup and basic connectivity.
   * 
   * @example
   * ```typescript
   * // Client usage:
   * const greeting = await trpc.hello.hello.query();
   * // Returns: "Hello from tRPC v11!"
   * ```
   */
  hello: publicProcedure
    .query(async ({ ctx }) => {
      // Touch DB to demonstrate Prisma availability (no-op if DB offline)
      try {
        await ctx.prisma.$queryRaw`SELECT 1`;
      } catch {
        // ignore in sample
      }
      return {
        message: 'Hello from tRPC v11!',
        timestamp: new Date(),
        version: '11.x',
        platform: 'Electron',
      };
    }),

  /**
   * Personalized hello query that accepts a name parameter.
   * 
   * This procedure demonstrates input validation using Zod schemas,
   * showing how to handle user input safely in tRPC procedures.
   * 
   * @example
   * ```typescript
   * // Client usage:
   * const greeting = await trpc.hello.helloWithName.query({ name: 'Simon' });
   * // Returns: { message: "Hello Simon!", ... }
   * 
   * // Invalid input will be caught by Zod validation:
   * // await trpc.hello.helloWithName.query({ name: '' }); // Throws validation error
   * ```
   */
  helloWithName: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Name must be at least 1 character long')
          .max(50, 'Name must be less than 50 characters')
          .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
      })
    )
    .query(async ({ input }) => {
      const { name } = input;
      
      return {
        message: `Hello ${name}!`,
        timestamp: new Date(),
        version: '11.x',
        platform: 'Electron',
        inputReceived: name,
        characterCount: name.length,
      };
    }),

  /**
   * Echo query that returns the input data for testing purposes.
   * 
   * This procedure is useful for debugging and testing the tRPC
   * communication between main and renderer processes in Electron.
   * 
   * @example
   * ```typescript
   * // Client usage:
   * const echo = await trpc.hello.echo.query({ 
   *   text: 'Test message',
   *   number: 42,
   *   boolean: true 
   * });
   * // Returns the exact input data with additional metadata
   * ```
   */
  echo: publicProcedure
    .input(
      z.object({
        text: z.string().optional(),
        number: z.number().optional(),
        boolean: z.boolean().optional(),
        array: z.array(z.string()).optional(),
      })
    )
    .query(async ({ input }) => {
      return {
        echo: input,
        timestamp: new Date(),
        message: 'Echo response from tRPC v11',
        inputType: typeof input,
        hasText: 'text' in input,
        hasNumber: 'number' in input,
        hasBoolean: 'boolean' in input,
        hasArray: 'array' in input,
      };
    }),
});
