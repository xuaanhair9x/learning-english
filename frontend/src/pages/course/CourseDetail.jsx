import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { coursesAPI, lessonsAPI } from '../../api';
import TopNav from '../../components/TopNav';
import './CourseDetail.css';

export default function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [vocabulary, setVocabulary] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [cRes, lRes] = await Promise.all([
                    coursesAPI.get(id),
                    coursesAPI.lessons(id),
                ]);
                setCourse(cRes.data);
                const ls = lRes.data.data || [];
                setLessons(ls);
                if (ls.length > 0) {
                    setActiveLesson(ls[0].id);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, [id]);

    useEffect(() => {
        if (!activeLesson) return;
        lessonsAPI.get(activeLesson).then(res => {
            setVocabulary(res.data.vocabulary || []);
        });
    }, [activeLesson]);

    if (loading) return <div className="page-loading">Đang tải...</div>;
    if (!course) return <div className="page-error">Không tìm thấy khóa học</div>;

    return (
        <div className="course-detail-page">
            <TopNav />

            <div className="course-detail-header">
                <Link to="/" className="back-btn">← Quay lại</Link>
                <div className="course-detail-meta">
                    <h1>{course.title}</h1>
                    <p>{course.description}</p>
                    <div className="course-stats">
                        <span>📚 {course.total_words} từ</span>
                        <span>📝 {lessons.length} bài học</span>
                    </div>
                </div>
            </div>

            <div className="course-detail-body">
                {/* Lessons List */}
                <div className="lessons-panel">
                    <h3>Danh sách bài học</h3>
                    {lessons.map(lesson => (
                        <button
                            key={lesson.id}
                            className={`lesson-item ${activeLesson === lesson.id ? 'active' : ''}`}
                            onClick={() => setActiveLesson(lesson.id)}
                        >
                            <span className="lesson-order">{lesson.order}</span>
                            <div>
                                <div className="lesson-name">{lesson.title}</div>
                                <div className="lesson-desc">{lesson.description}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Vocabulary Panel */}
                <div className="vocab-panel">
                    <h3>Từ vựng</h3>
                    {vocabulary.length === 0 ? (
                        <p className="no-vocab">Chọn bài học để xem từ vựng</p>
                    ) : (
                        <div className="vocab-list">
                            {vocabulary.map(v => (
                                <div key={v.id} className="vocab-card">
                                    <div className="vocab-word">
                                        <span className="word">{v.word}</span>
                                        <span className="phonetic">{v.phonetic}</span>
                                        <span className="pos-badge">{v.part_of_speech}</span>
                                    </div>
                                    <div className="vocab-meanings">
                                        <p className="definition">{v.definition}</p>
                                        <p className="vietnamese">🇻🇳 {v.vietnamese}</p>
                                    </div>
                                    {v.example_en && (
                                        <div className="vocab-example">
                                            <p className="ex-en">"{v.example_en}"</p>
                                            <p className="ex-vi">{v.example_vi}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
