import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../common/Modal';
import { Button } from '../common/Button';
import { supabase } from '../../lib/supabase';

// Default fallback coordinates (campus center)
const FALLBACK_COORDS = { lat: 17.5945, lng: 78.4403 };

/**
 * SOSButton - Emergency trigger button with geolocation + Supabase dispatch
 */
function SOSButton({ className, onTrigger }) {
    const [isPressed, setIsPressed] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [issueType, setIssueType] = useState('Medical');
    const [note, setNote] = useState('');
    const [sosState, setSosState] = useState('idle'); // idle | locating | dispatching | sent | error
    const [errorMsg, setErrorMsg] = useState('');

    const handlePress = () => {
        setIssueType('Medical');
        setNote('');
        setSosState('idle');
        setErrorMsg('');
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setSosState('locating');

        // Get GPS coordinates
        let coords;
        try {
            const position = await new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation not supported'));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });
            coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        } catch (geoError) {
            console.warn('Geolocation failed, using fallback:', geoError.message);
            coords = FALLBACK_COORDS;
        }

        // Insert into Supabase
        setSosState('dispatching');
        const { error } = await supabase.from('incidents').insert({
            lat: coords.lat,
            lng: coords.lng,
            type: `${issueType} SOS`,
            note: note.trim() || null,
            status: 'active',
        });

        if (error) {
            console.error('SOS dispatch failed:', error);
            setSosState('error');
            setErrorMsg('Dispatch failed. Please try again.');
            return;
        }

        setSosState('sent');
        onTrigger?.({ type: issueType, note, coords });

        // Auto-close after 3 seconds
        setTimeout(() => {
            setShowConfirm(false);
            setSosState('idle');
        }, 3000);
    };

    const issueTypes = [
        { id: 'Medical', icon: '🏥', label: 'Medical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        { id: 'Safety', icon: '🛡️', label: 'Safety', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
        { id: 'Fire', icon: '🔥', label: 'Fire', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        { id: 'Other', icon: '⚠️', label: 'Other', color: 'bg-zinc-700/50 text-zinc-300 border-zinc-600' }
    ];

    const isProcessing = sosState === 'locating' || sosState === 'dispatching';

    const getConfirmButtonContent = () => {
        switch (sosState) {
            case 'locating':
                return <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Locating...</>;
            case 'dispatching':
                return <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Dispatching...</>;
            case 'sent':
                return <><CheckCircle2 className="w-4 h-4 mr-2" /> Help is on the way!</>;
            case 'error':
                return <><AlertTriangle className="w-4 h-4 mr-2" /> Retry Dispatch</>;
            default:
                return <><AlertTriangle className="w-4 h-4 mr-2" /> Dispatch Help</>;
        }
    };

    return (
        <>
            {/* SOS Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                onClick={handlePress}
                className={cn(
                    'relative group',
                    className
                )}
            >
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" style={{ animationDelay: '0.5s' }} />

                {/* Button body */}
                <div
                    className={cn(
                        'relative w-20 h-20 rounded-full flex flex-col items-center justify-center',
                        'bg-gradient-to-br from-red-500 to-red-700',
                        'shadow-xl glow-danger',
                        'border-2 border-red-400/50',
                        'transition-all duration-200',
                        isPressed && 'from-red-600 to-red-800 scale-95'
                    )}
                >
                    <AlertTriangle className="w-6 h-6 text-white mb-0.5" />
                    <span className="text-xs font-bold text-white tracking-wider">SOS</span>
                </div>

                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800 rounded-lg text-xs text-zinc-50 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Emergency Alert
                </div>
            </motion.button>

            {/* Confirmation Modal */}
            <Modal isOpen={showConfirm} onClose={() => { if (!isProcessing) setShowConfirm(false); }} className="max-w-2xl">
                <ModalHeader>
                    <ModalTitle className="flex items-center gap-3 text-red-400">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        Emergency Alert
                    </ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        {/* Success state */}
                        {sosState === 'sent' && (
                            <div className="py-6 text-center">
                                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Help is on the way!</h3>
                                <p className="text-zinc-400">Responders have been notified of your location.</p>
                            </div>
                        )}

                        {/* Error state */}
                        {sosState === 'error' && (
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30 text-center">
                                <p className="text-red-300 font-medium">{errorMsg}</p>
                            </div>
                        )}

                        {/* Form - visible when idle or error */}
                        {(sosState === 'idle' || sosState === 'error') && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-zinc-400 mb-3 block">What's the emergency?</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {issueTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setIssueType(type.id)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                                                    type.id === issueType
                                                        ? `${type.color} border-current ring-1 ring-inset ring-current/50`
                                                        : "bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:bg-zinc-800 hover:border-zinc-600"
                                                )}
                                            >
                                                <span className="text-2xl mb-1">{type.icon}</span>
                                                <span className="text-xs font-medium">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-zinc-400 mb-2 block">
                                        Additional details <span className="text-zinc-600">(optional)</span>
                                    </label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Floor number, room, specific threat..."
                                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 resize-none h-20"
                                    />
                                </div>

                                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 flex gap-3 items-start">
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-200/80 leading-relaxed">
                                        Responders will be dispatched to your current location immediately.
                                        <span className="block mt-1 font-medium text-red-400">Only use for genuine emergencies.</span>
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Processing state */}
                        {isProcessing && (
                            <div className="py-8 text-center">
                                <Loader2 className="w-12 h-12 text-red-400 mx-auto mb-4 animate-spin" />
                                <p className="text-zinc-300 font-medium">
                                    {sosState === 'locating' ? 'Getting your location...' : 'Dispatching emergency alert...'}
                                </p>
                            </div>
                        )}
                    </div>
                </ModalBody>
                {sosState !== 'sent' && (
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setShowConfirm(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={sosState === 'error' ? handleConfirm : handleConfirm}
                            className="w-full sm:w-auto"
                            disabled={isProcessing}
                        >
                            {getConfirmButtonContent()}
                        </Button>
                    </ModalFooter>
                )}
            </Modal>
        </>
    );
}

export { SOSButton };
