import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Modal Component - Animated modal dialog
 * TODO: Replace with HeroUI/React-Bits modal component
 */
function Modal({
    isOpen,
    onClose,
    children,
    className,
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
    ...props
}) {
    // Handle escape key
    const handleEscape = useCallback((e) => {
        if (e.key === 'Escape' && closeOnEscape) {
            onClose?.();
        }
    }, [closeOnEscape, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            onClose?.();
        }
    };



    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'relative z-10 w-full max-w-lg',
                            'bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl',
                            className
                        )}
                        {...props}
                    >
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-zinc-50 transition-colors rounded-lg hover:bg-zinc-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

function ModalHeader({ className, children, ...props }) {
    return (
        <div className={cn('px-6 py-4 border-b border-zinc-800', className)} {...props}>
            {children}
        </div>
    );
}

function ModalTitle({ className, children, ...props }) {
    return (
        <h2 className={cn('text-xl font-semibold text-zinc-50', className)} {...props}>
            {children}
        </h2>
    );
}

function ModalBody({ className, children, ...props }) {
    return (
        <div className={cn('px-6 py-4', className)} {...props}>
            {children}
        </div>
    );
}

function ModalFooter({ className, children, ...props }) {
    return (
        <div className={cn('px-6 py-4 border-t border-zinc-800 flex justify-end gap-3', className)} {...props}>
            {children}
        </div>
    );
}

export { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter };
