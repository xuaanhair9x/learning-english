import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for Text-to-Speech using the Web Speech API.
 * @returns {{ speak, cancel, isPlaying }}
 */
export default function useTTS() {
    const [isPlaying, setIsPlaying] = useState(false);
    const utterRef = useRef(null);

    const speak = useCallback((text, { rate = 1, lang = 'en-US', onBoundary, onEnd } = {}) => {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = rate;
        if (onBoundary) utter.onboundary = onBoundary;
        utter.onend = () => {
            setIsPlaying(false);
            onEnd?.();
        };
        utterRef.current = utter;
        setIsPlaying(true);
        window.speechSynthesis.speak(utter);
    }, []);

    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    }, []);

    return { speak, cancel, isPlaying };
}
