import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
}

const CURSOR_OFFSET = 12;
const VIEWPORT_PADDING = 20;

export default function Tooltip({ content, children, className = '' }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent) => {
        setMouse({ x: e.clientX, y: e.clientY });
        setVisible(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (visible) setMouse({ x: e.clientX, y: e.clientY });
    };

    const left = Math.max(VIEWPORT_PADDING, Math.min(mouse.x + CURSOR_OFFSET, window.innerWidth - 320));
    const top = Math.max(VIEWPORT_PADDING, Math.min(mouse.y + CURSOR_OFFSET, window.innerHeight - 280));

    return (
        <span
            className={`relative inline-flex items-center gap-1 cursor-help border-b border-dotted border-[var(--color-accent)] ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-50 min-w-[20rem] max-w-[calc(100vw-40px)] px-4 py-3 text-sm rounded-lg border-2 border-[var(--color-border)] text-[var(--color-text)] shadow-xl overflow-y-auto max-h-64 pointer-events-none"
                        style={{
                            backgroundColor: '#000',
                            left,
                            top,
                        }}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
