import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '../../lib/cn';
import { StatusDot } from '../common/Badge';

/**
 * Header - Hardware-tactical top bar with system status
 * Solid bg-surface, no glassmorphism, semantic colors
 */
function Header({ className }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOnline, setIsOnline] = useState(true);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time as HH:MM:SS
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Format date
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <header
            className={cn(
                'h-14 bg-surface border-b border-border flex items-center justify-between px-6',
                className
            )}
        >
            {/* Left section - Page title area */}
            <div className="flex items-center gap-4">
                <h1 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Tactical Command
                </h1>
            </div>

            {/* Right section - Status & Time */}
            <div className="flex items-center gap-6">
                {/* System Status */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <StatusDot status={isOnline ? 'online' : 'offline'} pulse={isOnline} />
                    <span className={cn(
                        'text-xs font-semibold uppercase tracking-wider',
                        isOnline ? 'text-command' : 'text-muted-foreground'
                    )}>
                        {isOnline ? 'Grid Online' : 'Offline'}
                    </span>
                    {isOnline ? (
                        <Wifi className="w-4 h-4 text-command" />
                    ) : (
                        <WifiOff className="w-4 h-4 text-muted-foreground" />
                    )}
                </motion.div>

                {/* Separator */}
                <div className="w-px h-6 bg-border" />

                {/* Date & Time */}
                <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-xs font-medium">{formatDate(currentTime)}</span>
                    <span className="font-mono text-sm text-foreground tabular-nums">
                        {formatTime(currentTime)}
                    </span>
                </div>
            </div>
        </header>
    );
}

export { Header };
