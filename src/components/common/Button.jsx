import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Button Component - Simple placeholder for library swap
 * TODO: Replace with HeroUI/React-Bits button component
 */
const Button = forwardRef(({
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        default: 'bg-zinc-800 text-zinc-50 hover:bg-zinc-700 focus:ring-zinc-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
        safe: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500',
        ghost: 'bg-transparent text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50',
        outline: 'border border-zinc-700 bg-transparent text-zinc-50 hover:bg-zinc-800',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
