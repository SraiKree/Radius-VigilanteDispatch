import { cn } from '../../lib/cn';

/**
 * Card Component - Base card with dark surface styling
 * Supports glassmorphism variant and header/footer slots
 */
function Card({ className, variant = 'default', children, ...props }) {
    const variants = {
        default: 'bg-zinc-900 border border-zinc-800',
        glass: 'glass',
        'glass-dark': 'glass-dark',
        elevated: 'bg-zinc-900 border border-zinc-800 shadow-xl shadow-black/20',
    };

    return (
        <div
            className={cn(
                'rounded-xl',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function CardHeader({ className, children, ...props }) {
    return (
        <div
            className={cn('px-5 py-4 border-b border-zinc-800', className)}
            {...props}
        >
            {children}
        </div>
    );
}

function CardTitle({ className, children, ...props }) {
    return (
        <h3
            className={cn('text-lg font-semibold text-zinc-50', className)}
            {...props}
        >
            {children}
        </h3>
    );
}

function CardDescription({ className, children, ...props }) {
    return (
        <p
            className={cn('text-sm text-zinc-400 mt-1', className)}
            {...props}
        >
            {children}
        </p>
    );
}

function CardContent({ className, children, ...props }) {
    return (
        <div className={cn('px-5 py-4', className)} {...props}>
            {children}
        </div>
    );
}

function CardFooter({ className, children, ...props }) {
    return (
        <div
            className={cn('px-5 py-4 border-t border-zinc-800', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
