import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
}

const CURSOR_OFFSET = 12;
const VIEWPORT_PADDING = 16;
const TOOLTIP_MAX_HEIGHT_PX = 256; // match max-h-64

/** Use visualViewport on mobile so we stay in the visible area (e.g. with address bar). */
function getViewportSize(): { w: number; h: number } {
    if (typeof window === 'undefined') return { w: 320, h: 568 };
    const vv = window.visualViewport;
    if (vv) return { w: vv.width, h: vv.height };
    return { w: window.innerWidth, h: window.innerHeight };
}

/** Compute position so the tooltip stays fully inside the viewport. */
function clampToViewport(
    x: number,
    y: number,
): { left: number; top: number } {
    const maxW = Math.min(320, getViewportSize().w - VIEWPORT_PADDING * 2);
    const maxH = TOOLTIP_MAX_HEIGHT_PX;
    const { w, h } = getViewportSize();
    const left = Math.max(VIEWPORT_PADDING, Math.min(x, w - VIEWPORT_PADDING - maxW));
    const top = Math.max(VIEWPORT_PADDING, Math.min(y, h - VIEWPORT_PADDING - maxH));
    return { left, top };
}

const tooltipPopup = (
    visible: boolean,
    position: { left: number; top: number },
    content: string,
) =>
    visible ? (
        <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] min-w-[20rem] max-w-[min(20rem,calc(100vw-32px))] px-4 py-3 text-sm rounded-lg border-2 border-[var(--color-border)] text-[var(--color-text)] shadow-xl overflow-y-auto max-h-64 pointer-events-none"
            style={{
                backgroundColor: '#000',
                left: position.left,
                top: position.top,
            }}
        >
            {content}
        </motion.div>
    ) : null;

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

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (typeof window === 'undefined') return;
            const canHover = window.matchMedia('(hover: hover)').matches;
            if (canHover) return;
            const t = e.changedTouches?.[0] ?? e.touches?.[0];
            if (t) {
                updatePosition(t.clientX, t.clientY);
                setVisible(true);
            }
        },
        [updatePosition],
    );

    useEffect(() => {
        if (!visible) return;
        const hide = () => setVisible(false);
        document.addEventListener('scroll', hide, true);
        window.visualViewport?.addEventListener('resize', hide);
        return () => {
            document.removeEventListener('scroll', hide, true);
            window.visualViewport?.removeEventListener('resize', hide);
        };
    }, [visible]);

    const popup = (
        <AnimatePresence>
            {tooltipPopup(visible, position, content)}
        </AnimatePresence>
    );

    return (
        <>
            <span
                className={`relative inline cursor-help underline decoration-dotted decoration-2 underline-offset-2 [text-decoration-color:var(--color-accent)] ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setVisible(false)}
                onClick={handleClick}
                onTouchStart={handleTouchStart}
            >
                {children}
            </span>
            {typeof document !== 'undefined' && createPortal(popup, document.body)}
        </>
    );
}
