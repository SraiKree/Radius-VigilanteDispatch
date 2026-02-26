import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle2,
    Radius,
    MapPin,
    Clock,
    User
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Badge } from '../common/Badge';

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
    active: 'text-emerald-400',
    resolved: 'text-zinc-400',
    urgent: 'text-red-400',
    info: 'text-blue-400',
};

/**
 * LiveFeed - Real-time event feed overlay panel
 */
function LiveFeed({ className }) {
    return (
        <div
            className={cn(
                'w-80 glass-dark rounded-xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]',
                className
            )}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-semibold text-zinc-50">Live Feed</h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">
                    {mockEvents.length} events
                </span>
            </div>

            {/* Events list */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {mockEvents.map((event, index) => {
                        const Icon = eventIcons[event.type] || Radius;

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="px-4 py-3 border-b border-zinc-800/30 hover:bg-zinc-800/30 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={cn(
                                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                        event.status === 'urgent' ? 'bg-red-500/20' : 'bg-zinc-800'
                                    )}>
                                        <Icon className={cn('w-4 h-4', statusColors[event.status])} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-medium text-zinc-50 truncate">
                                                {event.title}
                                            </p>
                                            {event.status === 'urgent' && (
                                                <Badge variant="urgent" className="text-[10px]">
                                                    URGENT
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{event.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 text-xs text-zinc-600">
                                                <Clock className="w-3 h-3" />
                                                <span>{event.time}</span>
                                            </div>
                                            {event.responder && (
                                                <span className="font-mono text-xs text-zinc-500">
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
            </div>

            {/* Footer gradient fade */}
            <div className="h-8 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none -mt-8 relative z-10" />
        </div>
    );
}

export { LiveFeed };
