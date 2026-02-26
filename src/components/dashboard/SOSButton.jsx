import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../common/Modal';
import { Button } from '../common/Button';

/**
 * SOSButton - Emergency trigger button
 * TODO: Replace with React-Bits/HeroUI animated button component
 * 
 * This is a modular component designed to be easily swapped
 * with a premium animated component library button
 */
function SOSButton({ className, onTrigger }) {
    const [isPressed, setIsPressed] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [issueType, setIssueType] = useState('Medical');
    const [note, setNote] = useState('');

    const handlePress = () => {
        setIssueType('Medical');
        setNote('');
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        onTrigger?.({ type: issueType, note });
    };

    const issueTypes = [
        { id: 'Medical', icon: '🏥', label: 'Medical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        { id: 'Safety', icon: '🛡️', label: 'Safety', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
        { id: 'Fire', icon: '🔥', label: 'Fire', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        { id: 'Other', icon: '⚠️', label: 'Other', color: 'bg-zinc-700/50 text-zinc-300 border-zinc-600' }
    ];

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
            <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} className="max-w-2xl">
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
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirm} className="w-full sm:w-auto">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Dispatch Help
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export { SOSButton };
