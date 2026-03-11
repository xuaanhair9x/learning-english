import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sentencesAPI } from '../api';
import './ReadAloudSession.css';

export default function ReadAloudSession() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sentence, setSentence] = useState(null);
    const [total, setTotal] = useState(0);
    const [mode, setMode] = useState('read'); // 'read' | 'shadowing'

    // ── Read Aloud state ─────────────────────────────────────────
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(null);
    const [spokenText, setSpokenText] = useState('');

    // ── Shadowing state ──────────────────────────────────────────
    const [shadowState, setShadowState] = useState('idle'); // idle | playing | done
    const [currentWordIdx, setCurrentWordIdx] = useState(-1);
    const [shadowRecordings, setShadowRecordings] = useState([]);
    const [shadowSpoken, setShadowSpoken] = useState('');
    const [shadowProgress, setShadowProgress] = useState(0);

    // refs
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const recognition = useRef(null);
    const shadowRecognition = useRef(null);
    const progressTimer = useRef(null);
    const utteranceRef = useRef(null);

    // ── Fetch sentence ────────────────────────────────────────────
    useEffect(() => {
        window.speechSynthesis.cancel();
        setShadowState('idle');
        setCurrentWordIdx(-1);
        setShadowProgress(0);
        setIsPlaying(false);
        setIsRecording(false);
        setSpokenText('');
        setShadowSpoken('');

        sentencesAPI.get(id).then(res => setSentence(res.data));
        sentencesAPI.list({ page: 1 }).then(res => setTotal(res.data.total || 0));
    }, [id]);

    const words = sentence ? sentence.content.split(' ') : [];

    // ── TTS helpers ───────────────────────────────────────────────
    const speak = (rate = 1) => {
        if (!sentence) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(sentence.content);
        utter.lang = 'en-US';
        utter.rate = rate;
        utter.onend = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utter);
    };

    // ── Score ─────────────────────────────────────────────────────
    const scoreText = (spoken, original) => {
        const a = original.toLowerCase().replace(/[.,?!']/g, '').split(/\s+/);
        const b = spoken.toLowerCase().replace(/[.,?!']/g, '').split(/\s+/);
        let correct = 0;
        a.forEach(word => { if (b.includes(word)) correct++; });
        return Math.round((correct / a.length) * 35);
    };

    // ── Read Aloud: Record ────────────────────────────────────────
    const startReading = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];
            mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setRecordings(prev => [{ url, text: spokenText, ts: Date.now() }, ...prev]);
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.current.start();
            setSpokenText('');

            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SR) {
                recognition.current = new SR();
                recognition.current.lang = 'en-US';
                recognition.current.continuous = true;
                recognition.current.interimResults = true;
                recognition.current.onresult = e => {
                    const t = Array.from(e.results).map(r => r[0].transcript).join(' ');
                    setSpokenText(t);
                };
                recognition.current.start();
            }
            setIsRecording(true);
        } catch {
            alert('Cần quyền truy cập microphone.');
        }
    };

    const stopReading = () => {
        mediaRecorder.current?.stop();
        recognition.current?.stop();
        setIsRecording(false);
        setTimeout(() => {
            if (sentence && spokenText) {
                setScore(scoreText(spokenText, sentence.content));
                setShowScore(true);
            }
        }, 500);
    };

    // ── Shadowing: Play + Record + highlight ─────────────────────
    const startShadowing = useCallback(async () => {
        if (!sentence) return;
        window.speechSynthesis.cancel();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];
            mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setShadowRecordings(prev => [{ url, text: shadowSpoken, ts: Date.now() }, ...prev]);
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.current.start();

            // Speech recognition for shadow spoken text
            setShadowSpoken('');
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SR) {
                shadowRecognition.current = new SR();
                shadowRecognition.current.lang = 'en-US';
                shadowRecognition.current.continuous = true;
                shadowRecognition.current.interimResults = true;
                shadowRecognition.current.onresult = e => {
                    const t = Array.from(e.results).map(r => r[0].transcript).join(' ');
                    setShadowSpoken(t);
                };
                shadowRecognition.current.start();
            }

            // TTS with word boundary highlighting
            const utter = new SpeechSynthesisUtterance(sentence.content);
            utter.lang = 'en-US';
            utter.rate = 0.85;
            utteranceRef.current = utter;

            let wordCount = 0;
            const totalWords = words.length;

            utter.onboundary = (e) => {
                if (e.name === 'word') {
                    setCurrentWordIdx(wordCount);
                    setShadowProgress(Math.round((wordCount / totalWords) * 100));
                    wordCount++;
                }
            };

            utter.onend = () => {
                setCurrentWordIdx(totalWords); // all words done
                setShadowProgress(100);
                setShadowState('done');
                mediaRecorder.current?.stop();
                shadowRecognition.current?.stop();
                clearInterval(progressTimer.current);
            };

            setShadowState('playing');
            setCurrentWordIdx(-1);
            setShadowProgress(0);
            window.speechSynthesis.speak(utter);
        } catch {
            alert('Cần quyền truy cập microphone.');
        }
    }, [sentence, words.length, shadowSpoken]);

    const stopShadowing = () => {
        window.speechSynthesis.cancel();
        mediaRecorder.current?.stop();
        shadowRecognition.current?.stop();
        clearInterval(progressTimer.current);
        setShadowState('done');
        setCurrentWordIdx(-1);
    };

    const resetShadowing = () => {
        setShadowState('idle');
        setCurrentWordIdx(-1);
        setShadowProgress(0);
        setShadowSpoken('');
    };

    // ── Render sentence with word highlights ─────────────────────
    const renderSentenceRead = () => {
        if (!sentence) return null;
        const ws = sentence.content.split(' ');
        const spoken = spokenText.toLowerCase().split(/\s+/);
        return ws.map((w, i) => {
            const clean = w.replace(/[.,?!']/g, '').toLowerCase();
            return (
                <span key={i} className={`word-span ${isRecording && spoken.includes(clean) ? 'word-matched' : ''}`}>
                    {w}{' '}
                </span>
            );
        });
    };

    const renderSentenceShadow = () => {
        if (!sentence) return null;
        const ws = sentence.content.split(' ');
        return ws.map((w, i) => {
            let cls = 'word-span';
            if (currentWordIdx > i) cls += ' word-done';
            else if (currentWordIdx === i) cls += ' word-current';
            return <span key={i} className={cls}>{w}{' '}</span>;
        });
    };

    if (!sentence) return <div className="page-loading">Đang tải...</div>;

    const numId = Number(id);

    return (
        <div className="ra-session-page">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="ra-session-header">
                <button className="back-btn" onClick={() => { window.speechSynthesis.cancel(); navigate('/read-aloud'); }}>
                    ✕ {sentence.content.substring(0, 45)}{sentence.content.length > 45 ? '…' : ''}
                </button>
                <span className={`level-badge level-${sentence.level}`}>{sentence.level}</span>
            </div>

            {/* ── Body ───────────────────────────────────────────────── */}
            <div className="ra-session-body">
                <div className="ra-session-title">{mode === 'shadowing' ? 'Shadowing' : 'Phát âm'}</div>

                {/* Mode tabs */}
                <div className="ra-mode-tabs">
                    <button className={`mode-tab ${mode === 'read' ? 'active' : ''}`} onClick={() => { window.speechSynthesis.cancel(); resetShadowing(); setMode('read'); }}>
                        📢 Đọc to
                    </button>
                    <button className={`mode-tab ${mode === 'shadowing' ? 'active' : ''}`} onClick={() => { window.speechSynthesis.cancel(); setMode('shadowing'); }}>
                        🎭 Shadowing
                    </button>
                </div>

                {/* ════════════ READ ALOUD MODE ════════════ */}
                {mode === 'read' && (
                    <>
                        <div className="ra-playback-bar">
                            <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={() => speak(1)} title="Bình thường">
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button className="play-btn slow" onClick={() => speak(0.6)} title="Chậm">🐢</button>
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
                                    <span className="spoken-preview">{spokenText || 'Đang nghe...'}</span>
                                    <button className="record-btn stop" onClick={stopReading}>⏹ Dừng ghi âm</button>
                                </div>
                            ) : (
                                <button className="record-fab" onClick={startReading}>🎤</button>
                            )}
                        </div>

                        {recordings.length > 0 && (
                            <div className="my-recordings">
                                <h3>🎙 Ghi âm của tôi</h3>
                                {recordings.map((rec, i) => (
                                    <div key={rec.ts} className="recording-item">
                                        <div className="rec-info">
                                            <span className="rec-number">#{recordings.length - i}</span>
                                            {rec.text && <span className="rec-transcript">"{rec.text}"</span>}
                                        </div>
                                        <audio controls src={rec.url} className="rec-audio" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ════════════ SHADOWING MODE ════════════ */}
                {mode === 'shadowing' && (
                    <>
                        {/* Playback progress bar */}
                        <div className="ra-playback-bar">
                            <button className={`play-btn ${shadowState === 'playing' ? 'playing' : ''}`}
                                onClick={shadowState === 'playing' ? stopShadowing : startShadowing}
                                title={shadowState === 'playing' ? 'Dừng' : 'Bắt đầu Shadowing'}
                            >
                                {shadowState === 'playing' ? '⏹' : '▶'}
                            </button>
                            <button className="play-btn slow" onClick={() => speak(0.6)} title="Nghe chậm trước">🐢</button>
                            <div className="shadow-progress-wrap">
                                <div className="shadow-progress-bar">
                                    <div className="shadow-progress-fill" style={{ width: `${shadowProgress}%` }} />
                                </div>
                            </div>
                            <span className="shadow-progress-label">{shadowProgress}%</span>
                        </div>

                        {/* Sentence with word-by-word green highlight */}
                        <div className="ra-sentence-display">
                            <p className="ra-sentence-big">{renderSentenceShadow()}</p>
                            <p className="ra-sentence-vi">{sentence.vietnamese}</p>
                        </div>

                        {/* Instructions / Tip */}
                        <div className="shadow-tip">
                            <span className="tip-icon">💡</span>
                            <div>
                                <strong>Shadowing là gì?</strong>
                                <p>Nghe và nói theo <em>ngay lập tức</em>, cùng lúc với audio. Nhấn ▶ để bắt đầu — mic sẽ ghi âm giọng bạn trong khi câu được phát.</p>
                            </div>
                        </div>

                        {/* Spoken text preview while recording */}
                        {shadowState === 'playing' && (
                            <div className="shadow-listening">
                                <div className="recording-pulse small" />
                                <span className="spoken-preview">{shadowSpoken || 'Hãy đọc theo câu trên...'}</span>
                            </div>
                        )}

                        {/* Shadow recordings */}
                        {shadowRecordings.length > 0 && (
                            <div className="my-recordings">
                                <h3>🎙 Ghi âm Shadowing của tôi</h3>
                                {shadowRecordings.map((rec, i) => (
                                    <div key={rec.ts} className="recording-item">
                                        <div className="rec-info">
                                            <span className="rec-number">#{shadowRecordings.length - i}</span>
                                            {rec.text && <span className="rec-transcript">"{rec.text}"</span>}
                                        </div>
                                        <audio controls src={rec.url} className="rec-audio" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="shadow-nav">
                            <button
                                className="shadow-nav-btn prev"
                                onClick={() => { window.speechSynthesis.cancel(); navigate(`/read-aloud/${numId - 1}`); }}
                                disabled={numId <= 1}
                            >
                                ← Lùi lại
                            </button>
                            <button
                                className="shadow-nav-btn reset"
                                onClick={resetShadowing}
                            >
                                🔄 Làm lại
                            </button>
                            <button
                                className="shadow-nav-btn next"
                                onClick={() => { window.speechSynthesis.cancel(); navigate(`/read-aloud/${numId + 1}`); }}
                                disabled={numId >= total}
                            >
                                Lưu và Đổi →
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ── Score Modal (Read Aloud mode) ───────────────────────── */}
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
                        {spokenText && (
                            <div className="score-sentence">
                                <span className="score-label">Bạn nói:</span>
                                <span className="score-spoken">{spokenText}</span>
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
        </div>
    );
}
