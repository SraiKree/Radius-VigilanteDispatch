import { useState } from 'react';
import { motion } from 'framer-motion';
import { TacticalMap, LiveFeed, SOSButton } from '../components/dashboard';
import { useAuth } from '../lib/AuthContext';

// Mock incidents data - lifted here so admin can manage them
const initialIncidents = [
    {
        id: 'inc-1',
        type: 'Medical SOS',
        lat: 17.5948,
        lng: 78.4405,
        time: '2 mins ago',
        description: 'Student experiencing severe allergic reaction.',
    },
    {
        id: 'inc-2',
        type: 'Security Alert',
        lat: 17.5940,
        lng: 78.4398,
        time: '5 mins ago',
        description: 'Suspicious activity reported near library entrance.',
    },
];

/**
 * DashboardPage - Main tactical command view
 * Full-screen map with overlay panels
 */
function DashboardPage() {
    const { isAdmin } = useAuth();
    const [incidents, setIncidents] = useState(initialIncidents);

    const handleSOS = () => {
        console.log('SOS triggered!');
        // TODO: Implement actual SOS dispatch with Supabase
    };

    const handleDeleteIncident = (incidentId) => {
        setIncidents((prev) => prev.filter((inc) => inc.id !== incidentId));
    };

    return (
        <div className="w-full h-full relative">
            {/* Map Container - Full screen background */}
            <div className="absolute inset-0 z-0">
                <TacticalMap
                    incidents={incidents}
                    onDeleteIncident={handleDeleteIncident}
                    isAdmin={isAdmin}
                />
            </div>

            {/* Overlay panels */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Right panel - Live Feed */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="absolute top-4 right-4 bottom-24 pointer-events-auto"
                >
                    <LiveFeed />
                </motion.div>

                {/* Bottom right - SOS Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="absolute bottom-6 right-6 pointer-events-auto"
                >
                    <SOSButton onTrigger={handleSOS} />
                </motion.div>

                {/* Bottom left - Quick stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="absolute bottom-6 left-6 pointer-events-auto"
                >
                    <div className="glass-dark rounded-xl px-4 py-3 flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">12</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Online</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-700" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-400">3</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Active</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-700" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-400">{incidents.length}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Incidents</p>
                        </div>
                    </div>
                </motion.div>

                {/* Admin mode badge */}
                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-4 left-4 pointer-events-auto"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            HQ Command Mode — Click incidents to manage
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
