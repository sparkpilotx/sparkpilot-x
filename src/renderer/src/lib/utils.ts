import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for combining CSS class names with Tailwind CSS optimization.
 *
 * This function merges multiple class values (strings, objects, arrays) into a
 * single string, with intelligent deduplication and Tailwind CSS class merging.
 * It uses clsx for conditional class logic and tailwind-merge for optimal
 * Tailwind CSS class combination.
 * @param {...ClassValue[]} inputs - Variable number of class values to combine
 * @returns {string} Merged and optimized CSS class string
 * @example
 * ```tsx
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500') // 'text-red-500 bg-blue-500'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class') // 'base-class active-class' or 'base-class'
 *
 * // Tailwind optimization
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500' (last one wins)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
