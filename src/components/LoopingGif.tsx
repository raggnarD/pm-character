import React, { useRef, useEffect } from 'react';

interface LoopingGifProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

/**
 * Ensures the GIF restarts when the tab becomes visible again,
 * so it keeps looping even if the browser paused it in the background.
 */
const LoopingGif: React.FC<LoopingGifProps> = ({ src, ...imgProps }) => {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        const restartAnimation = () => {
            const baseSrc = src.split('?')[0];
            img.src = baseSrc + '?_=' + Date.now();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                restartAnimation();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [src]);

    return <img ref={imgRef} src={src} {...imgProps} />;
};

export default LoopingGif;
