/**
 * Sample components for demonstrating tRPC v11 functionality.
 * 
 * This module exports all sample components that showcase various tRPC features
 * and patterns for Electron applications, organized by router.
 */

// Export hello-query router components and container
export * from './hello-query';
// Export hello-mutation router components and container
export * from './hello-mutation';
// Export hello-subscription router components and container
export * from './hello-subscription';
// Export ideas router components and container
export * from './ideas';

// Export main samples container that organizes all router samples
export { default as SamplesContainer } from './samples-container';

// Export a convenient default that includes all router samples
export { default } from './samples-container';
