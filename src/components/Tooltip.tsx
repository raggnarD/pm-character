import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
}

const CURSOR_OFFSET = 12;
const VIEWPORT_PADDING = 16;
const TOOLTIP_MAX_HEIGHT_PX = 256; // match max-h-64

/** Compute position so the tooltip stays fully inside the viewport. */
function clampToViewport(
    x: number,
    y: number,
): { left: number; top: number } {
    const maxW = Math.min(320, typeof window !== 'undefined' ? window.innerWidth - VIEWPORT_PADDING * 2 : 320);
    const maxH = TOOLTIP_MAX_HEIGHT_PX;
    const w = typeof window !== 'undefined' ? window.innerWidth : 320;
    const h = typeof window !== 'undefined' ? window.innerHeight : 568;
    const left = Math.max(VIEWPORT_PADDING, Math.min(x, w - VIEWPORT_PADDING - maxW));
    const top = Math.max(VIEWPORT_PADDING, Math.min(y, h - VIEWPORT_PADDING - maxH));
    return { left, top };
}

export default function Tooltip({ content, children, className = '' }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    const updatePosition = useCallback((clientX: number, clientY: number) => {
        setPosition(clampToViewport(clientX + CURSOR_OFFSET, clientY + CURSOR_OFFSET));
    }, []);

    const handleMouseEnter = (e: React.MouseEvent) => {
        updatePosition(e.clientX, e.clientY);
        setVisible(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (visible) updatePosition(e.clientX, e.clientY);
    };

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (typeof window === 'undefined') return;
            const canHover = window.matchMedia('(hover: hover)').matches;
            if (canHover) return; // desktop: rely on hover
            e.preventDefault();
            if (visible) {
                setVisible(false);
            } else {
                updatePosition(e.clientX, e.clientY);
                setVisible(true);
            }
        },
        [visible, updatePosition],
    );

    return (
        <span
            className={`relative inline-flex items-center gap-1 cursor-help border-b border-dotted border-[var(--color-accent)] ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setVisible(false)}
            onClick={handleClick}
        >
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-[100] min-w-[20rem] max-w-[min(20rem,calc(100vw-32px))] px-4 py-3 text-sm rounded-lg border-2 border-[var(--color-border)] text-[var(--color-text)] shadow-xl overflow-y-auto max-h-64 pointer-events-none"
                        style={{
                            backgroundColor: '#000',
                            left: position.left,
                            top: position.top,
                        }}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
