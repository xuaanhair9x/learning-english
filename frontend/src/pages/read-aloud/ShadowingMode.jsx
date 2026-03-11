import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTTS from '../../hooks/useTTS';
import useRecorder from '../../hooks/useRecorder';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

export default function ShadowingMode({ sentence, id, total }) {
    const navigate = useNavigate();
    const { speak, cancel, isPlaying } = useTTS();
    const { startRecording, stopRecording, recordings, clearRecordings } = useRecorder();
    const { startListening, stopListening, transcript, resetTranscript } = useSpeechRecognition();

    const [shadowState, setShadowState] = useState('idle'); // idle | playing | done
    const [currentWordIdx, setCurrentWordIdx] = useState(-1);
    const [shadowProgress, setShadowProgress] = useState(0);

    const words = sentence ? sentence.content.split(' ') : [];
    const totalWords = words.length;

    const handleStart = async (rate = 0.85) => {
        if (!sentence) return;
        cancel();

        // start recording and tracking
        if (await startRecording()) {
            resetTranscript();
            startListening({ lang: 'en-US' });

            let wordCount = 0;
            speak(sentence.content, {
                rate,
                onBoundary: (e) => {
                    if (e.name === 'word') {
                        setCurrentWordIdx(wordCount);
                        setShadowProgress(Math.round((wordCount / totalWords) * 100));
                        wordCount++;
                    }
                },
                onEnd: () => {
                    setCurrentWordIdx(totalWords);
                    setShadowProgress(100);
                    setShadowState('done');
                    stopRecording();
                    stopListening();
                }
            });

            setShadowState('playing');
            setCurrentWordIdx(-1);
            setShadowProgress(0);
        }
    };

    const handleStop = () => {
        cancel();
        stopRecording();
        stopListening();
        setShadowState('done');
        setCurrentWordIdx(-1);
    };

    const handleReset = () => {
        setShadowState('idle');
        setCurrentWordIdx(-1);
        setShadowProgress(0);
        resetTranscript();
        clearRecordings();
    };

    const renderSentenceShadow = () => {
        if (!sentence) return null;
        return words.map((w, i) => {
            let cls = 'word-span';
            if (currentWordIdx > i) cls += ' word-done';
            else if (currentWordIdx === i) cls += ' word-current';
            return <span key={i} className={cls}>{w}{' '}</span>;
        });
    };

    const numId = Number(id);

    return (
        <>
            <div className="ra-playback-bar">
                <button className={`play-btn ${shadowState === 'playing' ? 'playing' : ''}`}
                    onClick={shadowState === 'playing' ? handleStop : () => handleStart(0.85)}
                    title={shadowState === 'playing' ? 'Dừng' : 'Bắt đầu Shadowing'}
                >
                    {shadowState === 'playing' ? '⏹' : '▶'}
                </button>
                <button className="play-btn slow" onClick={() => handleStart(0.6)} title="Nghe chậm trước">🐢</button>
                <div className="shadow-progress-wrap">
                    <div className="shadow-progress-bar">
                        <div className="shadow-progress-fill" style={{ width: `${shadowProgress}%` }} />
                    </div>
                </div>
                <span className="shadow-progress-label">{shadowProgress}%</span>
            </div>

            <div className="ra-sentence-display">
                <p className="ra-sentence-big">{renderSentenceShadow()}</p>
                <p className="ra-sentence-vi">{sentence.vietnamese}</p>
            </div>

            <div className="shadow-tip">
                <span className="tip-icon">💡</span>
                <div>
                    <strong>Shadowing là gì?</strong>
                    <p>Nghe và nói theo <em>ngay lập tức</em>, cùng lúc với audio. Nhấn ▶ để bắt đầu — mic ghi âm trong khi câu phát.</p>
                </div>
            </div>

            {shadowState === 'playing' && (
                <div className="shadow-listening">
                    <div className="recording-pulse small" />
                    <span className="spoken-preview">{transcript || 'Hãy đọc theo câu trên...'}</span>
                </div>
            )}

            {recordings.length > 0 && (
                <div className="my-recordings">
                    <h3>🎙 Ghi âm Shadowing</h3>
                    {recordings.map((rec, i) => (
                        <div key={rec.ts} className="recording-item">
                            <div className="rec-info">
                                <span className="rec-number">#{recordings.length - i}</span>
                            </div>
                            <audio controls src={rec.url} className="rec-audio" />
                        </div>
                    ))}
                </div>
            )}

            <div className="shadow-nav">
                <button className="shadow-nav-btn prev" onClick={() => navigate(`/read-aloud/${numId - 1}`)} disabled={numId <= 1}>
                    ← Lùi lại
                </button>
                <button className="shadow-nav-btn reset" onClick={handleReset}>
                    🔄 Làm lại
                </button>
                <button className="shadow-nav-btn next" onClick={() => navigate(`/read-aloud/${numId + 1}`)} disabled={numId >= total}>
                    Tiếp tục →
                </button>
            </div>
        </>
    );
}
