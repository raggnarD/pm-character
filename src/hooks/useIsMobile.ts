import { useState, useEffect, useCallback } from 'react';

const MOBILE_MAX_WIDTH = 768;
const STORAGE_KEY = 'pm-character-view-mode';

export type ViewMode = 'auto' | 'desktop' | 'mobile';

/**
 * Detects mobile vs desktop from user-agent (primary) and viewport width (fallback / resize).
 * Returns isMobile and setViewMode so you can force desktop or mobile; choice is persisted in sessionStorage.
 */
export function useIsMobile(): { isMobile: boolean; viewMode: ViewMode; setViewMode: (mode: ViewMode) => void } {
    const [viewMode, setViewModeState] = useState<ViewMode>(() => {
        if (typeof window === 'undefined') return 'auto';
        const stored = window.sessionStorage.getItem(STORAGE_KEY) as ViewMode | null;
        return stored === 'desktop' || stored === 'mobile' ? stored : 'auto';
    });
    const [detectedMobile, setDetectedMobile] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return getIsMobile();
    });

    useEffect(() => {
        const check = () => setDetectedMobile(getIsMobile());
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const setViewMode = useCallback((mode: ViewMode) => {
        setViewModeState(mode);
        if (typeof window !== 'undefined') {
            if (mode === 'auto') window.sessionStorage.removeItem(STORAGE_KEY);
            else window.sessionStorage.setItem(STORAGE_KEY, mode);
        }
    }, []);

    const isMobile = viewMode === 'auto' ? detectedMobile : viewMode === 'mobile';
    return { isMobile, viewMode, setViewMode };
}

function getIsMobile(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS/i;
    const byUa = mobileRegex.test(ua);
    const byWidth = typeof window !== 'undefined' && window.innerWidth < MOBILE_MAX_WIDTH;
    return byUa || byWidth;
}
