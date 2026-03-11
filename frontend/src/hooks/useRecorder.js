import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for audio recording using the MediaRecorder API.
 * @returns {{ startRecording, stopRecording, isRecording, recordings }}
 */
export default function useRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const streamRef = useRef(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => {
                audioChunks.current.push(e.data);
            };

            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setRecordings((prev) => [{ url, ts: Date.now() }, ...prev]);
                streamRef.current?.getTracks().forEach((t) => t.stop());
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            return true;
        } catch {
            alert('Cần quyền truy cập microphone.');
            return false;
        }
    }, []);

    const stopRecording = useCallback(() => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    }, []);

    const clearRecordings = useCallback(() => setRecordings([]), []);

    return { startRecording, stopRecording, isRecording, recordings, clearRecordings };
}
