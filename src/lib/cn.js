import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge to resolve conflicts
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
