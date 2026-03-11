import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTTS from '../../hooks/useTTS';
import useRecorder from '../../hooks/useRecorder';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';

export default function ReadAloudMode({ sentence, id }) {
    const navigate = useNavigate();
    const { speak, isPlaying } = useTTS();
    const { startRecording, stopRecording, isRecording, recordings } = useRecorder();
    const { startListening, stopListening, transcript } = useSpeechRecognition();

    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(null);

    const scoreText = (spoken, original) => {
        const a = original.toLowerCase().replace(/[.,?!']/g, '').split(/\s+/);
        const b = spoken.toLowerCase().replace(/[.,?!']/g, '').split(/\s+/);
        let correct = 0;
        a.forEach(word => { if (b.includes(word)) correct++; });
        return Math.round((correct / a.length) * 35);
    };

    const handleStart = async () => {
        if (await startRecording()) {
            startListening({ lang: 'en-US' });
        }
    };

    const handleStop = () => {
        stopRecording();
        stopListening();
        setTimeout(() => {
            if (sentence && transcript) {
                setScore(scoreText(transcript, sentence.content));
                setShowScore(true);
            }
        }, 500);
    };

    const renderSentenceRead = () => {
        if (!sentence) return null;
        const ws = sentence.content.split(' ');
        const spoken = transcript.toLowerCase().split(/\s+/);
        return ws.map((w, i) => {
            const clean = w.replace(/[.,?!']/g, '').toLowerCase();
            return (
                <span key={i} className={`word-span ${isRecording && spoken.includes(clean) ? 'word-matched' : ''}`}>
                    {w}{' '}
                </span>
            );
        });
    };

    const numId = Number(id);

    return (
        <>
            <div className="ra-playback-bar">
                <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={() => speak(sentence.content, { rate: 1 })} title="Bình thường">
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="play-btn slow" onClick={() => speak(sentence.content, { rate: 0.6 })} title="Chậm">🐢</button>
                <div className="playback-wave">
                    {isPlaying && Array.from({ length: 18 }).map((_, i) => (
                        <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
                    ))}
                </div>
            </div>

            <div className="ra-sentence-display">
                <p className="ra-sentence-big">{renderSentenceRead()}</p>
                <p className="ra-sentence-vi">{sentence.vietnamese}</p>
            </div>

            <div className="ra-record-section">
                {isRecording ? (
                    <div className="recording-active">
                        <div className="recording-pulse" />
                        <span className="spoken-preview">{transcript || 'Đang nghe...'}</span>
                        <button className="record-btn stop" onClick={handleStop}>⏹ Dừng ghi âm</button>
                    </div>
                ) : (
                    <button className="record-fab" onClick={handleStart}>🎤</button>
                )}
            </div>

            {recordings.length > 0 && (
                <div className="my-recordings">
                    <h3>🎙 Ghi âm của tôi</h3>
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

            {showScore && (
                <div className="score-overlay" onClick={() => setShowScore(false)}>
                    <div className="score-modal" onClick={e => e.stopPropagation()}>
                        <h3>Kết quả Phát âm</h3>
                        <div className="score-circle">
                            <span className="score-val">{score}</span>
                            <span className="score-max">/35</span>
                        </div>
                        <p className="score-desc">
                            {score >= 30 ? '🎉 Xuất sắc!' : score >= 20 ? '👍 Tốt!' : score >= 10 ? '💪 Cố lên!' : '🔄 Hãy thử lại.'}
                        </p>
                        {sentence && (
                            <div className="score-sentence">
                                <span className="score-label">Câu mẫu:</span>
                                <span className="score-original">{sentence.content}</span>
                            </div>
                        )}
                        {transcript && (
                            <div className="score-sentence">
                                <span className="score-label">Bạn nói:</span>
                                <span className="score-spoken">{transcript}</span>
                            </div>
                        )}
                        <div className="score-actions">
                            <button className="score-retry" onClick={() => setShowScore(false)}>Thử lại</button>
                            <button className="score-next" onClick={() => { setShowScore(false); navigate(`/read-aloud/${numId + 1}`); }}>
                                Câu tiếp →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
