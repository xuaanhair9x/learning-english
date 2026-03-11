import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for Web Speech Recognition API.
 * @returns {{ startListening, stopListening, transcript, resetTranscript }}
 */
export default function useSpeechRecognition() {
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    const startListening = useCallback(({ lang = 'en-US', continuous = true, interimResults = true } = {}) => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return false;

        recognitionRef.current = new SR();
        recognitionRef.current.lang = lang;
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;

        recognitionRef.current.onresult = (e) => {
            const text = Array.from(e.results).map((r) => r[0].transcript).join(' ');
            setTranscript(text);
        };

        recognitionRef.current.start();
        return true;
    }, []);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
    }, []);

    const resetTranscript = useCallback(() => setTranscript(''), []);

    return { startListening, stopListening, transcript, resetTranscript };
}
