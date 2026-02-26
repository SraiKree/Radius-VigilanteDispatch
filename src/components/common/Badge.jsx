import { cn } from '../../lib/cn';

/**
 * Badge Component - Status indicator with semantic variants
 */
function Badge({ className, variant = 'default', children, ...props }) {
    const variants = {
        default: 'bg-zinc-800 text-zinc-300',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        // Status-specific variants
        online: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        offline: 'bg-zinc-700/50 text-zinc-500 border border-zinc-600/30',
        open: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        fulfilled: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        urgent: 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse-slow',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

/**
 * StatusDot - Simple colored dot indicator
 */
function StatusDot({ className, status = 'default', pulse = false, ...props }) {
    const colors = {
        default: 'bg-zinc-500',
        online: 'bg-emerald-500',
        offline: 'bg-zinc-600',
        danger: 'bg-red-500',
        warning: 'bg-amber-500',
    };

    return (
        <span
            className={cn(
                'inline-block w-2 h-2 rounded-full',
                colors[status],
                pulse && 'animate-pulse',
                className
            )}
            {...props}
        />
    );
}

export { Badge, StatusDot };
