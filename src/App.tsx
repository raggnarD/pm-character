import { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from './components/Layout/MainLayout';
import LoopingGif from './components/LoopingGif';
import HPMPStats from './components/HPMPStats';
import CharacterDetails, { ExperienceBar } from './components/CharacterDetails/CharacterDetails';
import CharacterStats from './components/CharacterDetails/CharacterStats';
import { useTheme } from './hooks/useTheme';
import { useIsMobile } from './hooks/useIsMobile';

import './App.css';

const LAYOUT_EDIT_STORAGE_KEY = 'pm-character-layout-offsets';
const LAYOUT_CANONICAL_STORAGE_KEY = 'pm-character-layout-canonical';

/** Saved layout when user clicks "Done editing". Used as base instead of MOBILE_LAYOUT when set. */
type CanonicalLayout = {
    spriteLeftPx: number;
    spriteTopPx: number;
    hpmpPaddingTopPx: number;
    levelBarX: number;
    levelBarY: number;
    hpmpBlockX: number;
    hpmpBlockY: number;
    rightColumnX: number;
    rightColumnY: number;
};

type LayoutOffsets = {
    spriteX: number;
    spriteY: number;
    hpmpPadding: number;
    levelBarX: number;
    levelBarY: number;
    hpmpBlockX: number;
    hpmpBlockY: number;
    rightColumnX: number;
    rightColumnY: number;
};

const DEFAULT_OFFSETS: LayoutOffsets = {
    spriteX: 0,
    spriteY: 0,
    hpmpPadding: 0,
    levelBarX: 0,
    levelBarY: 0,
    hpmpBlockX: 0,
    hpmpBlockY: 0,
    rightColumnX: 0,
    rightColumnY: 0,
};

function loadLayoutOffsets(): LayoutOffsets {
    try {
        const raw = window.localStorage.getItem(LAYOUT_EDIT_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Partial<LayoutOffsets>;
            return { ...DEFAULT_OFFSETS, ...parsed } as LayoutOffsets;
        }
    } catch {
        // ignore
    }
    return { ...DEFAULT_OFFSETS };
}

function saveLayoutOffsets(offsets: LayoutOffsets) {
    try {
        window.localStorage.setItem(LAYOUT_EDIT_STORAGE_KEY, JSON.stringify(offsets));
    } catch {
        // ignore
    }
}

function loadCanonicalLayout(): CanonicalLayout | null {
    try {
        const raw = window.localStorage.getItem(LAYOUT_CANONICAL_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<CanonicalLayout>;
        if (
            typeof parsed?.spriteLeftPx !== 'number' ||
            typeof parsed?.spriteTopPx !== 'number' ||
            typeof parsed?.hpmpPaddingTopPx !== 'number'
        )
            return null;
        return {
            spriteLeftPx: parsed.spriteLeftPx ?? 0,
            spriteTopPx: parsed.spriteTopPx ?? 0,
            hpmpPaddingTopPx: parsed.hpmpPaddingTopPx ?? 0,
            levelBarX: Number(parsed.levelBarX) || 0,
            levelBarY: Number(parsed.levelBarY) || 0,
            hpmpBlockX: Number(parsed.hpmpBlockX) || 0,
            hpmpBlockY: Number(parsed.hpmpBlockY) || 0,
            rightColumnX: Number(parsed.rightColumnX) || 0,
            rightColumnY: Number(parsed.rightColumnY) || 0,
        };
    } catch {
        return null;
    }
}

function saveCanonicalLayout(layout: CanonicalLayout) {
    try {
        window.localStorage.setItem(LAYOUT_CANONICAL_STORAGE_KEY, JSON.stringify(layout));
    } catch {
        // ignore
    }
}

/** Desktop-only layout: fixed sprite (original position), then content row left/right, all transparent. */
function DesktopLayout() {
    return (
        <div className="desktop-layout-root">
            <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden z-0 pointer-events-none desktop-sprite-bg">
                <LoopingGif
                    src="sprites/ff7-rebirth/modern-sprite-loop.gif?v=2"
                    alt="Character Sprite"
                    className="h-full w-auto absolute left-[60px] top-0"
                    style={{
                        objectFit: 'contain',
                        transform: 'translateX(-45%) translateY(60px) scale(1.08)',
                        transformOrigin: 'left center'
                    }}
                />
            </div>
            <MainLayout>
                <div className="relative z-10 p-8" style={{ backgroundColor: 'transparent' }}>
                    <div className="flex flex-row items-start w-full">
                        <div
                            className="flex-shrink-0"
                            style={{ width: 'min(50vw, 50%)', minWidth: 'min(50vw, 50%)' }}
                            aria-hidden
                        >
                            <HPMPStats />
                        </div>
                        <div className="flex-1 min-w-0 pl-6 lg:pl-8 max-w-xl flex flex-col">
                            <CharacterDetails />
                            <CharacterStats />
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
}

/** Mobile layout: tuned for iPhone 16 (393×852) / iPhone 17 (402×874) with safe areas. */
const MOBILE_LAYOUT = {
    pagePaddingPx: 12,
    leftColumnWidthPx: 148,
    spriteLeftPx: 12,
    spriteTopPx: 0,
    spriteMaxHeightPx: 280,
    spriteTranslateXPx: -24,
    spriteTranslateYPx: 24,
    spriteScale: 0.55,
    /** Drag overlay to match visible sprite (scale 0.55, translate). */
    spriteDragOverlayLeftPx: -24,
    spriteDragOverlayTopPx: 82,
    spriteDragOverlayWidthPx: 176,
    spriteDragOverlayHeightPx: 176,
    hpmpPaddingTopPx: 240,
    rightColumnPaddingLeftPx: 12,
} as const;

/** Base layout: from saved canonical or MOBILE_LAYOUT. Offsets are added to get effective position. */
function getMobileBaseLayout(canonical: CanonicalLayout | null): CanonicalLayout {
    if (canonical) return canonical;
    return {
        spriteLeftPx: -67,
        spriteTopPx: 9,
        hpmpPaddingTopPx: 149,
        levelBarX: 0,
        levelBarY: 0,
        hpmpBlockX: -54,
        hpmpBlockY: -18,
        rightColumnX: 49,
        rightColumnY: -16,
    };
}

/** Mobile layout: Level bar top-left, sprite below it, HP/MP below sprite; details + stats on right. */
function MobileLayout({
    layoutEditMode,
    baseLayout,
    offsets,
    setOffsets,
}: {
    layoutEditMode: boolean;
    baseLayout: CanonicalLayout;
    offsets: LayoutOffsets;
    setOffsets: (v: LayoutOffsets | ((prev: LayoutOffsets) => LayoutOffsets)) => void;
}) {
    const spriteRef = useRef<HTMLDivElement>(null);
    const hpmpSpacerRef = useRef<HTMLDivElement>(null);

    const effectiveSpriteLeft = baseLayout.spriteLeftPx + offsets.spriteX;
    const effectiveSpriteTop = baseLayout.spriteTopPx + offsets.spriteY;
    const effectiveHpmpPadding = baseLayout.hpmpPaddingTopPx + offsets.hpmpPadding;

    type DragKey = keyof Pick<
        LayoutOffsets,
        'spriteX' | 'spriteY' | 'levelBarX' | 'levelBarY' | 'hpmpBlockX' | 'hpmpBlockY' | 'rightColumnX' | 'rightColumnY'
    >;
    const startDragXY = useCallback(
        (keyX: DragKey, keyY: DragKey, clientX: number, clientY: number) => {
            if (!layoutEditMode) return;
            const startX = clientX;
            const startY = clientY;
            const startOffsets = { ...offsets };
            const onMove = (e: PointerEvent) => {
                setOffsets((prev) => ({
                    ...prev,
                    [keyX]: startOffsets[keyX] + (e.clientX - startX),
                    [keyY]: startOffsets[keyY] + (e.clientY - startY),
                }));
            };
            const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
        },
        [layoutEditMode, offsets, setOffsets]
    );

    const startDragSprite = useCallback(
        (clientX: number, clientY: number) => {
            if (!layoutEditMode) return;
            const startX = clientX;
            const startY = clientY;
            const startOffsets = { ...offsets };
            const onMove = (e: PointerEvent) => {
                setOffsets((prev) => ({
                    ...prev,
                    spriteX: startOffsets.spriteX + (e.clientX - startX),
                    spriteY: startOffsets.spriteY + (e.clientY - startY),
                }));
            };
            const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
        },
        [layoutEditMode, offsets, setOffsets]
    );

    const startDragHpmpSpacer = useCallback(
        (_clientX: number, clientY: number) => {
            if (!layoutEditMode) return;
            const startY = clientY;
            const startOffsets = { ...offsets };
            const onMove = (e: PointerEvent) => {
                setOffsets((prev) => ({
                    ...prev,
                    hpmpPadding: startOffsets.hpmpPadding + (e.clientY - startY),
                }));
            };
            const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
        },
        [layoutEditMode, offsets, setOffsets, baseLayout]
    );

    return (
        <div className="mobile-layout-root overflow-visible">
            <div
                className={`fixed left-0 top-0 h-screen w-screen overflow-hidden ${layoutEditMode ? 'z-20 pointer-events-none' : 'z-0 pointer-events-none'}`}
            >
                <div
                    ref={spriteRef}
                    className="absolute"
                    style={{
                        left: effectiveSpriteLeft,
                        top: effectiveSpriteTop,
                        ...(layoutEditMode && { pointerEvents: 'none' as const }),
                    }}
                >
                    <LoopingGif
                        src="sprites/ff7-rebirth/modern-sprite-loop.gif?v=2"
                        alt="Character Sprite"
                        className="mobile-sprite block pointer-events-none"
                        style={{
                            maxHeight: MOBILE_LAYOUT.spriteMaxHeightPx,
                            width: 'auto',
                            objectFit: 'contain',
                            transform: `translateX(${MOBILE_LAYOUT.spriteTranslateXPx}px) translateY(${MOBILE_LAYOUT.spriteTranslateYPx}px) scale(${MOBILE_LAYOUT.spriteScale})`,
                            transformOrigin: 'left center',
                        }}
                    />
                    {layoutEditMode && (
                        <div
                            className="absolute cursor-grab active:cursor-grabbing"
                            style={{
                                left: MOBILE_LAYOUT.spriteDragOverlayLeftPx,
                                top: MOBILE_LAYOUT.spriteDragOverlayTopPx,
                                width: MOBILE_LAYOUT.spriteDragOverlayWidthPx,
                                height: MOBILE_LAYOUT.spriteDragOverlayHeightPx,
                                touchAction: 'none',
                                pointerEvents: 'auto',
                            }}
                            onPointerDown={(e) => {
                                if (e.button === 0) {
                                    e.currentTarget.setPointerCapture(e.pointerId);
                                    startDragSprite(e.clientX, e.clientY);
                                }
                            }}
                        />
                    )}
                </div>
            </div>
            <MainLayout>
                <div
                    className="relative z-10 flex flex-col gap-4 overflow-visible"
                    style={{
                        backgroundColor: 'transparent',
                        padding: MOBILE_LAYOUT.pagePaddingPx,
                    }}
                >
                    <div className="flex flex-row items-start w-full">
                        <div
                            className={`flex-shrink-0 ${layoutEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`.trim()}
                            style={{
                                width: 'max-content',
                                minWidth: MOBILE_LAYOUT.leftColumnWidthPx,
                                transform: `translate(${baseLayout.levelBarX + offsets.levelBarX}px, ${baseLayout.levelBarY + offsets.levelBarY}px)`,
                                ...(layoutEditMode && { touchAction: 'none' as const }),
                            }}
                            onPointerDown={(e) => {
                                if (layoutEditMode && e.button === 0) {
                                    e.currentTarget.setPointerCapture(e.pointerId);
                                    startDragXY('levelBarX', 'levelBarY', e.clientX, e.clientY);
                                }
                            }}
                        >
                            <ExperienceBar />
                        </div>
                        <div className="flex-1 min-w-0" />
                    </div>
                    <div className="flex flex-row items-start w-full">
                        <div
                            className="mobile-hpmp flex-shrink-0 flex flex-col items-start text-left relative"
                            style={{
                                width: MOBILE_LAYOUT.leftColumnWidthPx,
                                minWidth: MOBILE_LAYOUT.leftColumnWidthPx,
                                paddingTop: effectiveHpmpPadding,
                                }}
                        >
                            {layoutEditMode && (
                                <div
                                    ref={hpmpSpacerRef}
                                    className="absolute left-0 right-0 h-8 flex items-center justify-center border border-dashed border-[var(--color-accent)]/60 rounded bg-black/30 text-xs cursor-ns-resize z-20"
                                    style={{
                                        top: effectiveHpmpPadding - 16,
                                        touchAction: 'none',
                                    }}
                                    onPointerDown={(e) => {
                                        if (e.button === 0) {
                                            e.currentTarget.setPointerCapture(e.pointerId);
                                            startDragHpmpSpacer(e.clientX, e.clientY);
                                        }
                                    }}
                                >
                                    drag to move HP/MP
                                </div>
                            )}
                            <div
                                style={{
                                    transform: `translate(${baseLayout.hpmpBlockX + offsets.hpmpBlockX}px, ${baseLayout.hpmpBlockY + offsets.hpmpBlockY}px)`,
                                    ...(layoutEditMode && { touchAction: 'none' as const }),
                                }}
                                className={layoutEditMode ? 'cursor-grab active:cursor-grabbing' : ''}
                                onPointerDown={(e) => {
                                    if (layoutEditMode && e.button === 0) {
                                        e.currentTarget.setPointerCapture(e.pointerId);
                                        startDragXY('hpmpBlockX', 'hpmpBlockY', e.clientX, e.clientY);
                                    }
                                }}
                            >
                                <HPMPStats />
                            </div>
                        </div>
                        <div
                            className={`flex-1 min-w-0 flex flex-col gap-4 ${layoutEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`.trim()}
                            style={{
                                paddingLeft: MOBILE_LAYOUT.rightColumnPaddingLeftPx,
                                transform: `translate(${baseLayout.rightColumnX + offsets.rightColumnX}px, ${baseLayout.rightColumnY + offsets.rightColumnY}px)`,
                                ...(layoutEditMode && { touchAction: 'none' as const }),
                            }}
                            onPointerDown={(e) => {
                                if (layoutEditMode && e.button === 0) {
                                    e.currentTarget.setPointerCapture(e.pointerId);
                                    startDragXY('rightColumnX', 'rightColumnY', e.clientX, e.clientY);
                                }
                            }}
                        >
                            <CharacterDetails variant="mobile" />
                            <CharacterStats />
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
}

function App() {
    useTheme();
    const { isMobile, viewMode, setViewMode } = useIsMobile();

    const [layoutEditMode, setLayoutEditMode] = useState(() => {
        if (typeof window === 'undefined') return false;
        return new URLSearchParams(window.location.search).get('layout') === 'edit';
    });
    const [canonical, setCanonical] = useState<CanonicalLayout | null>(loadCanonicalLayout);
    const [offsets, setOffsetsState] = useState<LayoutOffsets>(loadLayoutOffsets);

    const baseLayout = getMobileBaseLayout(canonical);

    useEffect(() => {
        if (!layoutEditMode) return;
        saveLayoutOffsets(offsets);
    }, [layoutEditMode, offsets]);

    const setOffsets = useCallback((v: LayoutOffsets | ((prev: LayoutOffsets) => LayoutOffsets)) => {
        setOffsetsState((prev) => {
            const next = typeof v === 'function' ? v(prev) : v;
            saveLayoutOffsets(next);
            return next;
        });
    }, []);

    const effectiveValues = {
        spriteLeftPx: baseLayout.spriteLeftPx + offsets.spriteX,
        spriteTopPx: baseLayout.spriteTopPx + offsets.spriteY,
        hpmpPaddingTopPx: baseLayout.hpmpPaddingTopPx + offsets.hpmpPadding,
        levelBar: { x: baseLayout.levelBarX + offsets.levelBarX, y: baseLayout.levelBarY + offsets.levelBarY },
        hpmpBlock: { x: baseLayout.hpmpBlockX + offsets.hpmpBlockX, y: baseLayout.hpmpBlockY + offsets.hpmpBlockY },
        rightColumn: { x: baseLayout.rightColumnX + offsets.rightColumnX, y: baseLayout.rightColumnY + offsets.rightColumnY },
    };

    const handleDoneEditing = useCallback(() => {
        const saved: CanonicalLayout = {
            spriteLeftPx: effectiveValues.spriteLeftPx,
            spriteTopPx: effectiveValues.spriteTopPx,
            hpmpPaddingTopPx: effectiveValues.hpmpPaddingTopPx,
            levelBarX: effectiveValues.levelBar.x,
            levelBarY: effectiveValues.levelBar.y,
            hpmpBlockX: effectiveValues.hpmpBlock.x,
            hpmpBlockY: effectiveValues.hpmpBlock.y,
            rightColumnX: effectiveValues.rightColumn.x,
            rightColumnY: effectiveValues.rightColumn.y,
        };
        saveCanonicalLayout(saved);
        setCanonical(saved);
        setOffsetsState(DEFAULT_OFFSETS);
        saveLayoutOffsets(DEFAULT_OFFSETS);
        setLayoutEditMode(false);
    }, [effectiveValues.spriteLeftPx, effectiveValues.spriteTopPx, effectiveValues.hpmpPaddingTopPx, effectiveValues.levelBar.x, effectiveValues.levelBar.y, effectiveValues.hpmpBlock.x, effectiveValues.hpmpBlock.y, effectiveValues.rightColumn.x, effectiveValues.rightColumn.y]);

    const handleResetAll = useCallback(() => {
        try {
            window.localStorage.removeItem(LAYOUT_CANONICAL_STORAGE_KEY);
        } catch {
            // ignore
        }
        setCanonical(null);
        setOffsetsState(DEFAULT_OFFSETS);
        saveLayoutOffsets(DEFAULT_OFFSETS);
    }, []);

    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const handleCopyForCode = useCallback(async () => {
        const block = `    spriteLeftPx: ${Math.round(effectiveValues.spriteLeftPx)},
    spriteTopPx: ${Math.round(effectiveValues.spriteTopPx)},
    hpmpPaddingTopPx: ${Math.round(effectiveValues.hpmpPaddingTopPx)},
    levelBarX: ${Math.round(effectiveValues.levelBar.x)},
    levelBarY: ${Math.round(effectiveValues.levelBar.y)},
    hpmpBlockX: ${Math.round(effectiveValues.hpmpBlock.x)},
    hpmpBlockY: ${Math.round(effectiveValues.hpmpBlock.y)},
    rightColumnX: ${Math.round(effectiveValues.rightColumn.x)},
    rightColumnY: ${Math.round(effectiveValues.rightColumn.y)},`;
        try {
            await navigator.clipboard.writeText(block);
            setCopyFeedback('Copied!');
            setTimeout(() => setCopyFeedback(null), 2000);
        } catch {
            setCopyFeedback('Copy failed');
            setTimeout(() => setCopyFeedback(null), 2000);
        }
    }, [effectiveValues.spriteLeftPx, effectiveValues.spriteTopPx, effectiveValues.hpmpPaddingTopPx, effectiveValues.levelBar.x, effectiveValues.levelBar.y, effectiveValues.hpmpBlock.x, effectiveValues.hpmpBlock.y, effectiveValues.rightColumn.x, effectiveValues.rightColumn.y]);

    return (
        <div className={isMobile ? 'mobile-viewport-root overflow-visible' : ''}>
            {/* Top bar: switch Desktop / Mobile view */}
            <div
                className="app-top-bar fixed top-0 left-0 right-0 z-50 flex justify-center gap-2 px-2 bg-black/70 border-b border-[var(--color-border)]"
                style={{ color: 'var(--color-text)' }}
            >
                <button
                    type="button"
                    onClick={() => setViewMode('desktop')}
                    className={`px-3 py-1.5 rounded text-sm font-medium border ${
                        !isMobile ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/70'
                    }`}
                >
                    Desktop
                </button>
                <button
                    type="button"
                    onClick={() => setViewMode('mobile')}
                    className={`px-3 py-1.5 rounded text-sm font-medium border ${
                        isMobile ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/70'
                    }`}
                >
                    Mobile
                </button>
                {viewMode !== 'auto' && (
                    <button
                        type="button"
                        onClick={() => setViewMode('auto')}
                        className="px-3 py-1.5 rounded text-sm font-medium border border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/70"
                    >
                        Auto
                    </button>
                )}
                {isMobile && (
                    <button
                        type="button"
                        onClick={layoutEditMode ? handleDoneEditing : () => setLayoutEditMode(true)}
                        className={`ml-2 px-3 py-1.5 rounded text-sm font-medium border ${
                            layoutEditMode ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/70'
                        }`}
                    >
                        {layoutEditMode ? 'Done editing' : 'Edit layout'}
                    </button>
                )}
            </div>
            {/* Layout content — add top padding so it’s not under the bar */}
            <div className="app-content-wrap">
                {isMobile ? (
                    <MobileLayout layoutEditMode={layoutEditMode} baseLayout={baseLayout} offsets={offsets} setOffsets={setOffsets} />
                ) : (
                    <DesktopLayout />
                )}
            </div>
            {isMobile && layoutEditMode && (
                <div
                    className="app-edit-overlay fixed left-4 right-4 z-50 rounded-lg border border-[var(--color-border)] p-3 text-left text-xs font-mono bg-black/90 max-h-[40vh] overflow-auto"
                    style={{ color: 'var(--color-text)' }}
                >
                    <div className="font-semibold mb-2">Offsets (drag any element to move)</div>
                    <pre className="whitespace-pre-wrap break-all">
                        {`sprite: ${Math.round(effectiveValues.spriteLeftPx)}, ${Math.round(effectiveValues.spriteTopPx)}
hpmpPaddingTopPx: ${Math.round(effectiveValues.hpmpPaddingTopPx)}
levelBar: ${effectiveValues.levelBar.x}, ${effectiveValues.levelBar.y}
hpmpBlock: ${effectiveValues.hpmpBlock.x}, ${effectiveValues.hpmpBlock.y}
rightColumn: ${effectiveValues.rightColumn.x}, ${effectiveValues.rightColumn.y}`}
                    </pre>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                        <button
                            type="button"
                            onClick={handleCopyForCode}
                            className="px-2 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-accent)]"
                        >
                            Copy for code
                        </button>
                        <button
                            type="button"
                            onClick={handleResetAll}
                            className="px-2 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-accent)]"
                        >
                            Reset all
                        </button>
                        {copyFeedback && <span className="text-[var(--color-accent)] text-xs">{copyFeedback}</span>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
