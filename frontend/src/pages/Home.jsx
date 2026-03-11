import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import CourseCard from '../components/CourseCard';
import TopicCard from '../components/TopicCard';
import { coursesAPI, topicsAPI, progressAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const skills = [
    { id: 'speak', label: 'Nói', desc: 'Chiếm điểm & nhận xét thí lam chủ nhất', icon: '🎤', color: '#fef3c7', iconBg: '#f59e0b' },
    { id: 'listen', label: 'Nghe', desc: 'Luyện tập lắng nghe', icon: '🎧', color: '#eff6ff', iconBg: '#2563eb' },
];

export default function Home() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [cRes, tRes] = await Promise.all([
                    coursesAPI.list(),
                    topicsAPI.list(),
                ]);
                setCourses(cRes.data.data || []);
                setTopics(tRes.data.data || []);

                if (user) {
                    const pRes = await progressAPI.get();
                    setProgress(pRes.data.data || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    // Find current in-progress course
    const inProgress = progress.find(p => p.percent_done > 0 && p.percent_done < 100);
    const inProgressCourse = inProgress
        ? courses.find(c => c.id === inProgress.course_id)
        : courses[0];

    return (
        <div className="home-page">
            <TopNav />

            {/* ── Currently Learning ─────────────────────────── */}
            {inProgressCourse && (
                <section className="home-section">
                    <h2 className="section-title">Đang học</h2>
                    <Link to={`/course/${inProgressCourse.id}`} className="current-course-card">
                        <div className="current-course-icon">📘</div>
                        <div className="current-course-info">
                            <span className="current-course-tag">
                                {inProgress ? `${Math.round(inProgress.words_learned)} / ${inProgress.total_words} từ` : 'Bắt đầu ngay'}
                            </span>
                            <p className="current-course-title">{inProgressCourse.title}</p>
                            <div className="progress-bar-wrap">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${inProgress ? inProgress.percent_done : 0}%` }}
                                />
                            </div>
                        </div>
                        <span className="current-course-arrow">›</span>
                    </Link>
                </section>
            )}

            {/* ── Skills ─────────────────────────────────────── */}
            <section className="home-section">
                <h2 className="section-title">Luyện theo Kỹ năng</h2>
                <div className="skills-row">
                    {skills.map(skill => (
                        <div key={skill.id} className="skill-card" style={{ background: skill.color }}>
                            <div className="skill-icon-wrap" style={{ background: skill.iconBg }}>
                                <span>{skill.icon}</span>
                            </div>
                            <div className="skill-info">
                                <h4 className="skill-title">{skill.label}</h4>
                                <p className="skill-desc">{skill.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Course Vocabulary Sets ──────────────────────── */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Bộ từ vựng mới nhất</h2>
                    <Link to="/courses" className="see-all-link">Xem tất cả →</Link>
                </div>
                {loading ? (
                    <div className="skeleton-row">
                        {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
                    </div>
                ) : (
                    <div className="courses-scroll">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Topics ─────────────────────────────────────── */}
            <section className="home-section">
                <h2 className="section-title">Luyện theo Chủ đề</h2>
                {loading ? (
                    <div className="skeleton-list">
                        {[1, 2].map(i => <div key={i} className="skeleton-topic" />)}
                    </div>
                ) : (
                    <div className="topics-list">
                        {topics.slice(0, 4).map(topic => (
                            <TopicCard key={topic.id} topic={topic} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
