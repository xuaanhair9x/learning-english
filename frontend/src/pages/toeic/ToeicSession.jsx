import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ToeicSession.css';

// Static mocks replaced with API fetch

export default function ToeicSession() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // The config from the previous screen
    const config = location.state?.config || { timeLimit: 120 };

    const [started, setStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(config.timeLimit * 60);

    // Answer state
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);

    // Audio state
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // We assume part 1 is selected based on config or seed ID = 1
                const res = await fetch(`/api/toeic/parts/1/questions`);
                if (res.ok) {
                    const data = await res.json();
                    setQuestions(data || []);
                }
            } catch (error) {
                console.error("Failed to fetch TOEIC questions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [id]);

    useEffect(() => {
        let timer;
        if (started && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && started) {
            // Auto submit or end
        }
        return () => clearInterval(timer);
    }, [started, timeLeft]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIdx];

    const handleAnswerSelect = (opt) => {
        if (showResult) return; // Disallow changing answer in result review
        setAnswers(prev => ({ ...prev, [currentIdx]: opt }));
    };

    const toggleResult = () => {
        setShowResult(!showResult);
    };

    const handleAudioTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const resetAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setProgress(0);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải câu hỏi...</div>;

    if (!started) {
        return (
            <div className="toeic-session-container">
                <Header timeLeft={timeLeft} formatTime={formatTime} onExit={() => navigate(-1)} />
                <div className="intro-screen">
                    <div className="intro-content">
                        <h2 className="intro-title">Part 1: PHOTOGRAPHS</h2>
                        <p className="intro-text">
                            Directions: For each question, you will listen to four short statements about a picture in your test book. These statements will not be printed and will only be spoken one time. Select the statement that best describes what is happening in the picture and mark the corresponding letter (A), (B), (C), or (D) on your answer sheet.
                        </p>
                    </div>
                </div>
                <div className="start-btn-container">
                    <button className="session-start-btn" onClick={() => setStarted(true)}>BẮT ĐẦU</button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return <div>Loading question...</div>;

    const currentAnswer = answers[currentIdx];
    const isCorrect = showResult && currentAnswer === currentQuestion.correct_answer;

    return (
        <div className="toeic-session-container">
            <Header timeLeft={timeLeft} formatTime={formatTime} onExit={() => navigate(-1)} />

            <div className="testing-layout">
                {/* Left Media Panel */}
                <div className="left-panel">
                    <div className="media-header">
                        <div className="question-num">Câu {currentQuestion.question_num}</div>
                        <div className="audio-controls">
                            <button className="audio-btn" onClick={resetAudio}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                            <button className="audio-btn" onClick={togglePlay}>
                                {isPlaying ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                )}
                            </button>
                            <span className="audio-time">00:00</span>
                            <div className="audio-progress">
                                <div className="audio-progress-bar" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="audio-time">00:00</span>
                        </div>
                    </div>

                    <audio
                        ref={audioRef}
                        src={currentQuestion.audio_url}
                        onTimeUpdate={handleAudioTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        autoPlay
                    />

                    <div className="question-image-container">
                        <img src={currentQuestion.image_url} alt="Question" className="question-image" />
                    </div>
                </div>

                {/* Right Area containing Header and Panels */}
                <div className="right-area">
                    <div className="right-area-header">
                        <div className="nav-buttons">
                            <button className="nav-btn" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}>← Câu trước</button>
                            <button className={`nav-btn ${showResult ? 'active' : ''}`} onClick={toggleResult}>💡 Đáp án</button>
                            <button className="nav-btn" onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}>Câu sau →</button>
                        </div>
                    </div>

                    <div className="right-area-content">
                        {/* Middle Transcript/Explanation Panel (Toggled) */}
                        {showResult && (
                            <div className="middle-panel">
                                <div className="transcript-section">
                                    <div className="transcript-title">
                                        <span style={{ fontSize: '18px' }}>℗</span> Transcript & Giải thích
                                    </div>
                                    <div className="transcript-text">
                                        <strong>Câu hỏi:</strong><br />
                                        {currentQuestion.transcript}<br /><br />
                                        <strong>Đáp án đúng: ({currentQuestion.correct_answer})</strong><br /><br />
                                        <strong>Giải thích:</strong><br />
                                        {currentQuestion.explanation}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right Option Panel */}
                        <div className="options-panel">
                            <div className="options-title">Chọn đáp án</div>
                            <div className="options-list">
                                {['A', 'B', 'C', 'D'].map(opt => {
                                    let btnClass = "option-btn";
                                    if (showResult) {
                                        if (opt === currentQuestion.correct_answer) {
                                            btnClass += " correct";
                                        } else if (currentAnswer === opt) {
                                            btnClass += " wrong";
                                        }
                                    } else if (currentAnswer === opt) {
                                        btnClass += " selected";
                                    }

                                    return (
                                        <div key={opt} className="option-item">
                                            <button
                                                className={btnClass}
                                                onClick={() => handleAnswerSelect(opt)}
                                            >
                                                {opt}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Header = ({ timeLeft, formatTime, onExit }) => (
    <div className="session-header">
        <div className="header-left">
            <div className="logo-text">
                <span className="logo-voca">VOCA</span>
                <span className="logo-prep">PREP</span>
            </div>
            <button className="close-btn" onClick={onExit}>✕ Thoát</button>
        </div>

        <div className="timer-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {formatTime(timeLeft)}
        </div>

        <div className="header-actions">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
    </div>
);
