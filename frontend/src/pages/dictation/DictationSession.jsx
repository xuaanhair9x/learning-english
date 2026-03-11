import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dictationAPI } from '../../api';
import './DictationSession.css';

export default function DictationSession() {
    const { passageId } = useParams();
    const navigate = useNavigate();
    const [passage, setPassage] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [current, setCurrent] = useState(0);
    const [input, setInput] = useState('');
    const [chips, setChips] = useState([]); // shuffled word chips
    const [result, setResult] = useState(null); // { correct, answer, sentence, vietnamese }
    const [showAnswer, setShowAnswer] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const inputRef = useRef(null);

    useEffect(() => {
        Promise.all([
            dictationAPI.getPassage(passageId),
            dictationAPI.listExercises(passageId),
        ]).then(([pRes, exRes]) => {
            setPassage(pRes.data);
            setExercises(exRes.data);
        });
    }, [passageId]);

    // Build shuffled chips whenever exercise changes
    useEffect(() => {
        setInput('');
        setResult(null);
        setShowAnswer(false);
        if (exercises[current]) {
            const ex = exercises[current];
            const distractors = ex.distractors ? ex.distractors.split(',').map(s => s.trim()) : [];
            setChips(shuffle(distractors));
        }
        inputRef.current?.focus();
    }, [current, exercises]);

    function shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }

    const speak = () => {
        const ex = exercises[current];
        if (!ex) return;
        window.speechSynthesis.cancel();
        const text = ex.before_blank + ' ... ' + ex.after_blank;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = speed;
        setIsPlaying(true);
        utter.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utter);
    };

    const speakFull = () => {
        if (!result) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(result.sentence);
        utter.lang = 'en-US';
        utter.rate = 0.85;
        window.speechSynthesis.speak(utter);
    };

    const selectChip = (word) => {
        if (result) return;
        setInput(word);
    };

    const submitAnswer = async () => {
        if (!input.trim() || result) return;
        const ex = exercises[current];
        try {
            const res = await dictationAPI.checkAnswer(ex.id, input.trim());
            setResult(res.data);
            setScore(s => ({ correct: s.correct + (res.data.correct ? 1 : 0), total: s.total + 1 }));
            setShowAnswer(true);
        } catch (e) { console.error(e); }
    };

    const nextExercise = () => {
        window.speechSynthesis.cancel();
        if (current + 1 < exercises.length) {
            setCurrent(c => c + 1);
        } else {
            navigate(`/dictation`);
        }
    };

    const prevExercise = () => {
        window.speechSynthesis.cancel();
        if (current > 0) setCurrent(c => c - 1);
    };

    if (!passage || exercises.length === 0) {
        return <div className="page-loading">Đang tải bài tập...</div>;
    }

    const ex = exercises[current];
    const progress = Math.round(((current + 1) / exercises.length) * 100);

    return (
        <div className="dict-session-page">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="dict-header">
                <button className="dict-back" onClick={() => { window.speechSynthesis.cancel(); navigate(-1); }}>
                    ← {passage.title}
                </button>
                <div className="dict-progress-wrap">
                    <div className="dict-progress-bar">
                        <div className="dict-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <span className="dict-score">
                    {score.correct}/{score.total} ✓
                </span>
            </div>

            {/* ── Session Body ─────────────────────────────────────────── */}
            <div className="dict-body">
                <div className="dict-title">Nghe &amp; Điền từ</div>

                {/* Audio Controls */}
                <div className="dict-audio-bar">
                    <button className={`dict-play-btn ${isPlaying ? 'playing' : ''}`} onClick={speak}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="dict-play-btn slow" onClick={() => { setSpeed(0.6); setTimeout(speak, 50); }} title="Nghe chậm">
                        🐢
                    </button>
                    <div className="dict-audio-wave">
                        {isPlaying && Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className="dict-wave-bar" style={{ animationDelay: `${i * 0.06}s` }} />
                        ))}
                    </div>
                    <span className="dict-counter">{current + 1}/{exercises.length}</span>
                </div>

                {/* Sentence with blank */}
                <div className="dict-sentence-card">
                    {!showAnswer ? (
                        <div className="sentence-with-blank">
                            <span className="sb-text">{ex.before_blank} </span>
                            <input
                                ref={inputRef}
                                className={`blank-input ${input ? 'filled' : ''}`}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && submitAnswer()}
                                placeholder="..."
                                disabled={!!result}
                            />
                            <span className="sb-text"> {ex.after_blank}</span>
                        </div>
                    ) : (
                        <div className="sentence-revealed">
                            <span className="sr-before">{ex.before_blank} </span>
                            <span className={`sr-answer ${result?.correct ? 'correct' : 'wrong'}`}>{result?.answer}</span>
                            <span className="sr-after"> {ex.after_blank}</span>
                        </div>
                    )}
                </div>

                {/* Word chips */}
                {!showAnswer && chips.length > 0 && (
                    <div className="dict-chips">
                        {chips.map((chip, i) => (
                            <button
                                key={i}
                                className={`dict-chip ${input === chip ? 'selected' : ''}`}
                                onClick={() => selectChip(chip)}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                )}

                {/* Action buttons */}
                {!showAnswer ? (
                    <div className="dict-actions">
                        <button className="dict-hint-btn" onClick={speak}>🔊 Nghe lại</button>
                        <button className="dict-submit-btn" onClick={submitAnswer} disabled={!input.trim()}>
                            ✓ Trả lời
                        </button>
                    </div>
                ) : (
                    <div className="dict-actions">
                        <button className="dict-listen-full" onClick={speakFull}>🔊 Nghe câu đủ</button>
                    </div>
                )}
            </div>

            {/* ── Answer Modal ─────────────────────────────────────────── */}
            {showAnswer && result && (
                <div className={`dict-result-modal ${result.correct ? 'modal-correct' : 'modal-wrong'}`}>
                    <div className="modal-icon">{result.correct ? '✅ Đáp án đúng' : '❌ Đáp án sai'}</div>
                    <div className="modal-sentence">
                        <strong>Câu đầy đủ:</strong>
                        <p>{result.sentence}</p>
                    </div>
                    <div className="modal-vi">
                        <strong>Bản dịch:</strong>
                        <p>{result.vietnamese}</p>
                    </div>
                    <div className="modal-nav">
                        <button className="modal-prev" onClick={prevExercise} disabled={current === 0}>←</button>
                        <button className="modal-next" onClick={nextExercise}>
                            {current + 1 < exercises.length ? 'Tiếp tục' : 'Hoàn thành 🎉'}
                        </button>
                        <button className="modal-fwd" onClick={nextExercise} disabled={current + 1 >= exercises.length}>→</button>
                    </div>
                </div>
            )}
        </div>
    );
}
