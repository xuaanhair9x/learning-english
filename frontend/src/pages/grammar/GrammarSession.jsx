import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { grammarAPI } from '../../api';
import './GrammarSession.css';

export default function GrammarSession() {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [units, setUnits] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Exercise state
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch both the sidebar units and the current lesson content
                const [unitsRes, lessonRes] = await Promise.all([
                    grammarAPI.units(),
                    grammarAPI.lesson(lessonId)
                ]);

                setUnits(unitsRes.data);
                setCurrentLesson(lessonRes.data);
            } catch (err) {
                console.error("Failed to load grammar session", err);
                setError("Có lỗi xảy ra khi tải bài học ngữ pháp.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [lessonId]);

    // Reset state on lesson change
    useEffect(() => {
        setCurrentExerciseIndex(0);
        setAnswer('');
        setIsAnswered(false);
        setIsCorrect(false);
    }, [lessonId]);

    if (loading) return <div className="page-loading">Đang tải bài học...</div>;
    if (error) return <div className="page-error">{error}</div>;
    if (!currentLesson) return <div className="page-error">Không tìm thấy bài học!</div>;

    const flatLessons = units.flatMap(u => u.lessons || []);
    const currentIndex = flatLessons.findIndex(l => l.id === parseInt(lessonId));

    const handlePrev = () => {
        if (currentIndex > 0) {
            navigate(`/grammar/${flatLessons[currentIndex - 1].id}`);
        }
    };

    const handleNext = () => {
        if (currentIndex < flatLessons.length - 1) {
            navigate(`/grammar/${flatLessons[currentIndex + 1].id}`);
        }
    };

    const isFirst = currentIndex <= 0 && currentExerciseIndex === 0;
    const isLast = currentIndex === -1 || (currentIndex >= flatLessons.length - 1 && (currentLesson?.type !== 'exercise' || currentExerciseIndex >= (currentLesson.exercises?.length || 0) - 1));

    const exercises = currentLesson.exercises || [];
    const currentExercise = exercises[currentExerciseIndex];

    const handleCheckAnswer = () => {
        if (!answer.trim() || !currentExercise) return;

        setIsAnswered(true);
        const expectedAnswer = currentExercise.correct_answer || '';

        if (answer.toLowerCase().trim() === expectedAnswer.toLowerCase().trim()) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNextAction = () => {
        if (currentLesson.type === 'exercise') {
            if (currentExerciseIndex < exercises.length - 1) {
                // Go to next exercise within the same lesson
                setCurrentExerciseIndex(prev => prev + 1);
                setAnswer('');
                setIsAnswered(false);
                setIsCorrect(false);
                return;
            }
        }
        // Otherwise, go to next lesson
        handleNext();
    };

    return (
        <div className="grammar-session-page">
            <div className="grammar-session-main">
                <div className="grammar-session-header">
                    <button className="close-btn" onClick={() => navigate('/grammar')}>×</button>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{
                            width: currentLesson.type === 'exercise' && exercises.length > 0
                                ? `${((currentExerciseIndex + 1) / exercises.length) * 100}%`
                                : flatLessons.length > 0 ? `${((currentIndex + 1) / flatLessons.length) * 100}%` : '0%'
                        }}></div>
                    </div>
                    <span className="progress-text">
                        {currentLesson.type === 'exercise' && exercises.length > 0
                            ? `${currentExerciseIndex + 1}/${exercises.length}`
                            : `${currentIndex + 1}/${flatLessons.length}`}
                    </span>
                </div>

                <div className="grammar-session-scroll-area">
                    <div className="grammar-session-content">
                        <div className="lesson-main-title">{currentLesson.title.toUpperCase()}</div>
                        <h3 className="lesson-sub-title">Hướng dẫn và bài tập đi kèm</h3>

                        <div className="lesson-body-content">
                            {currentLesson.type === 'theory' ? (
                                <div className="markdown-content">
                                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                                </div>
                            ) : (
                                <div className="exercise-section">
                                    <div className="exercise-instruction">
                                        <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                                    </div>
                                    <div className="exercise-input-row">
                                        <div className="exercise-question-text">
                                            {currentExercise ? currentExercise.question : 'Không có câu hỏi trong bài tập này.'}
                                        </div>
                                        {currentExercise && (
                                            <input
                                                type="text"
                                                placeholder="Nhập đáp án..."
                                                value={answer}
                                                onChange={(e) => setAnswer(e.target.value)}
                                                disabled={isAnswered}
                                                className={isAnswered ? (isCorrect ? 'input-correct' : 'input-incorrect') : ''}
                                            />
                                        )}
                                    </div>

                                    {!isAnswered && currentExercise && (
                                        <div className="exercise-hint">
                                            💡 Ấn Enter/Phím cách/Dấu chấm để kiểm tra
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>

                    {isAnswered && (
                        <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                            <div className="feedback-header">
                                {isCorrect ? '✔️ Đáp án đúng!' : '❌ Đáp án chưa chính xác:'}
                            </div>
                            <div className="feedback-body">
                                <p><strong>Câu hỏi:</strong> {currentExercise ? currentExercise.question : ''}</p>
                                <p><strong>Giải thích:</strong> <ReactMarkdown>{currentExercise?.explanation || 'Không có giải thích chi tiết.'}</ReactMarkdown></p>
                            </div>
                            <div className="feedback-action">
                                <button
                                    className="nav-btn prev-btn"
                                    onClick={handlePrev}
                                    disabled={isFirst}
                                    style={{ opacity: isFirst ? 0.5 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
                                >← BÀI TRƯỚC</button>
                                <button
                                    className="nav-btn next-btn"
                                    onClick={handleNextAction}
                                    disabled={isLast}
                                    style={{ opacity: isLast ? 0.5 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}
                                >TIẾP TỤC →</button>
                            </div>
                        </div>
                    )}
                </div>

                {!isAnswered && (
                    <div className="grammar-session-footer">
                        <button
                            className="nav-btn prev-btn"
                            onClick={handlePrev}
                            disabled={isFirst}
                            style={{ opacity: isFirst ? 0.5 : 1, cursor: isFirst ? 'not-allowed' : 'pointer' }}
                        >← BÀI TRƯỚC</button>

                        {currentLesson.type === 'exercise' && currentExercise ? (
                            <button
                                className="nav-btn next-btn"
                                onClick={handleCheckAnswer}
                            >KIỂM TRA ✓</button>
                        ) : (
                            <button
                                className="nav-btn next-btn"
                                onClick={handleNextAction}
                                disabled={isLast}
                                style={{ opacity: isLast ? 0.5 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}
                            >TIẾP TỤC →</button>
                        )}
                    </div>
                )}
            </div>

            {/* Right Sidebar Area matching the image */}
            <div className="grammar-session-sidebar">
                <div className="sidebar-tabs">
                    <button className="sidebar-tab active">📋</button>
                    <button className="sidebar-tab">⭐</button>
                    <button className="sidebar-tab">⏱️</button>
                </div>

                <div className="sidebar-part-btn">← Phần 1 →</div>

                <div className="sidebar-units-list">
                    {units.map(unit => (
                        <div key={unit.id} className="sidebar-unit">
                            <div className="sidebar-unit-header">
                                <span>{unit.title}</span>
                            </div>
                            <div className="sidebar-unit-lessons">
                                {unit.lessons && unit.lessons.map(lesson => (
                                    <div
                                        key={lesson.id}
                                        className={`sidebar-lesson-item ${parseInt(lessonId) === lesson.id ? 'active' : ''}`}
                                        onClick={() => navigate(`/grammar/${lesson.id}`)}
                                    >
                                        <div className={`sidebar-lesson-icon ${lesson.type}`}>
                                            {lesson.type === 'exercise' ? '📝' : '📖'}
                                        </div>
                                        <span className="sidebar-lesson-title">{lesson.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
