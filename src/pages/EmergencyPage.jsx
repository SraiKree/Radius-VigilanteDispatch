import { motion } from 'framer-motion';
import { MapPin, Shield, Activity, Radius } from 'lucide-react';
import { TacticalMap, LiveFeed, SOSButton } from '../components/dashboard';
import { useIncidents } from '../hooks/useIncidents';

/**
 * EmergencyPage - Dedicated emergency response view
 * Simplified tactical interface focused on immediate response
 */
function EmergencyPage() {
    const { incidents } = useIncidents();

    const handleSOS = (data) => {
        console.log('SOS dispatched:', data);
    };

    return (
        <div className="w-full h-full relative bg-zinc-950 overflow-hidden">
            {/* Background Map - Dimmed for focus */}
            <div className="absolute inset-0 opacity-40">
                <div className="w-full h-full">
                    <TacticalMap incidents={incidents} />
                </div>
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full p-6 flex flex-col items-center justify-center">

                {/* Status Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-8 left-0 right-0 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400 tracking-wider uppercase">Grid Online • 12 Responders Active</span>
                    </div>
                </motion.div>

                {/* Central Emergency Control */}
                <div className="flex flex-col items-center gap-8 max-w-md w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Emergency Dispatch</h1>
                        <p className="text-zinc-400">Triggering an alert will instantly notify all nearby responders.</p>
                    </motion.div>

                    {/* Massive SOS Trigger */}
                    <div className="scale-150 py-8">
                        <SOSButton onTrigger={handleSOS} />
                    </div>

                    {/* Location Status */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Current Location</p>
                            <p className="text-zinc-200 font-mono text-sm">Library Complex, South Wing</p>
                            <p className="text-xs text-indigo-400/80 mt-0.5">GPS Accuracy: High</p>
                        </div>
                    </motion.div>
                </div>

                {/* Quick stats footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-8 flex gap-8"
                >
                    <div className="text-center">
                        <p className="text-2xl font-bold text-zinc-200">2 min</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Avg Response</p>
                    </div>
                    <div className="w-px h-10 bg-zinc-800" />
                    <div className="text-center">
                        <p className="text-2xl font-bold text-zinc-200">5</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Nearby Units</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default EmergencyPage;
