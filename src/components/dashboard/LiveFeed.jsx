import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle2,
    Radius,
    MapPin,
    Clock,
    User,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Badge } from '../common/Badge';

/**
 * Format a timestamp into a relative time string (e.g. "2 mins ago")
 */
function timeAgo(timestamp) {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Mock data for live feed
const mockEvents = [
    {
        id: 1,
        type: 'dispatch',
        title: 'Vigilante Dispatched',
        location: 'Block C, North Campus',
        time: '2 min ago',
        status: 'active',
        responder: 'V-042',
    },
    {
        id: 2,
        type: 'resolved',
        title: 'Incident Resolved',
        location: 'Library Plaza',
        time: '5 min ago',
        status: 'resolved',
        responder: 'V-017',
    },
    {
        id: 3,
        type: 'sos',
        title: 'SOS Alert',
        location: 'Parking Lot B',
        time: '8 min ago',
        status: 'urgent',
        responder: null,
    },
    {
        id: 4,
        type: 'online',
        title: 'Responder Online',
        location: 'Central Hub',
        time: '12 min ago',
        status: 'info',
        responder: 'V-089',
    },
    {
        id: 5,
        type: 'dispatch',
        title: 'Patrol Started',
        location: 'East Wing',
        time: '15 min ago',
        status: 'active',
        responder: 'V-023',
    },
];

const eventIcons = {
    dispatch: Radius,
    resolved: CheckCircle2,
    sos: AlertTriangle,
    online: User,
};

const statusColors = {
    active: 'text-command',
    resolved: 'text-muted-foreground',
    urgent: 'text-beacon',
    info: 'text-ledger',
};

/**
 * LiveFeed - Real-time event feed overlay panel
 */
function LiveFeed({ className, incidents = [] }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Update time every minute to keep relative times fresh
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Form real events or use mock if no real events are provided yet
    const displayEvents = incidents.length > 0
        ? incidents.map(inc => ({
            id: inc.id,
            type: inc.type?.toLowerCase().includes('sos') ? 'sos' : 'dispatch',
            title: inc.type || 'SOS Alert',
            location: `${inc.lat?.toFixed(4) || 0}, ${inc.lng?.toFixed(4) || 0}`,
            time: timeAgo(inc.created_at),
            status: inc.status === 'active' ? 'urgent' : 'resolved',
            responder: null
        }))
        : mockEvents;

    return (
        <div
            className={cn(
                'w-80 bg-surface rounded-xl overflow-hidden flex flex-col transition-all duration-300 border border-border',
                isExpanded ? 'max-h-[calc(100vh-8rem)]' : 'h-14',
                className
            )}
        >
            {/* Header */}
            <div
                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors z-20 bg-surface border-b border-border"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        displayEvents.some(e => e.type.includes('SOS')) ? "bg-beacon animate-pulse" :
                            displayEvents.some(e => e.status === 'urgent') ? "bg-beacon animate-pulse" : "bg-command"
                    )} />
                    <h3 className="text-sm font-semibold text-foreground">Live Feed</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                        {displayEvents.length} events
                    </span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>

            {/* Events list */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-1 overflow-y-auto relative z-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {displayEvents.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">No recent events</div>
                            ) : displayEvents.map((event, index) => {
                                const getEventStyle = (type, status) => {
                                    if (type.includes('SOS')) return { icon: '🚨', bg: 'bg-beacon/10 text-beacon' };
                                    if (type === 'dispatch') return { icon: '📍', bg: 'bg-command/10 text-command' };
                                    return { icon: null, bg: status === 'urgent' ? 'bg-beacon/10 text-beacon' : 'bg-surface text-muted-foreground border border-border' };
                                };
                                const style = getEventStyle(event.type, event.status);
                                const FallbackIcon = eventIcons[event.type] || Radius;

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="px-4 py-3 border-b border-border hover:bg-muted/10 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Icon */}
                                            <div className={cn(
                                                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                                style.bg.split(' ')[0]
                                            )}>
                                                {style.icon ? (
                                                    <span className="text-base leading-none">{style.icon}</span>
                                                ) : (
                                                    <FallbackIcon className={cn('w-4 h-4', style.bg.split(' ')[1])} />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {event.title}
                                                    </p>
                                                    {event.status === 'urgent' && (
                                                        <Badge variant="urgent" className="text-[10px] bg-beacon/10 text-beacon border-beacon/30">
                                                            URGENT
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate">{event.location}</span>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    {event.responder && (
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            {event.responder}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer gradient fade */}
            {isExpanded && (
                <div className="h-8 bg-gradient-to-t from-surface to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-20" />
            )}
        </div>
    );
}

export { LiveFeed };
