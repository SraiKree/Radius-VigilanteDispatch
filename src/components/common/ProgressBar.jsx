import { cn } from '../../lib/cn';

/**
 * ProgressBar Component - Simple placeholder for library swap
 * TODO: Replace with HeroUI/React-Bits progress component
 */
function ProgressBar({
    value = 0,
    max = 100,
    variant = 'default',
    className,
    ...props
}) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variants = {
        default: 'bg-zinc-500',
        safe: 'bg-emerald-500',
        bounty: 'bg-amber-500',
        danger: 'bg-red-500',
    };

    return (
        <div
            className={cn('h-2 w-full bg-zinc-800 rounded-full overflow-hidden', className)}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            {...props}
        >
            <div
                className={cn('h-full rounded-full transition-all duration-300', variants[variant])}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export { ProgressBar };
