import { Link } from 'react-router-dom';
import './CourseCard.css';

export default function CourseCard({ course }) {
    const colors = [
        { bg: '#1e3a8a', accent: '#3b82f6' },
        { bg: '#065f46', accent: '#10b981' },
        { bg: '#581c87', accent: '#a855f7' },
        { bg: '#7c2d12', accent: '#f97316' },
        { bg: '#0f172a', accent: '#38bdf8' },
    ];
    const color = colors[course.id % colors.length];

    return (
        <Link to={`/course/${course.id}`} className="course-card">
            <div
                className="course-card-cover"
                style={{ background: `linear-gradient(145deg, ${color.bg}, ${color.accent}33)`, borderColor: color.accent + '44' }}
            >
                <div className="cover-mascot">
                    {course.category === 'TOEIC' ? '🎧' : '📚'}
                </div>
                <div className="cover-text">
                    <div className="cover-brand">VOCA PREP</div>
                    <div className="cover-label">{course.cover_label}</div>
                    <div className="cover-sublabel">{course.sub_label}</div>
                </div>
            </div>
            <div className="course-card-footer">
                <p className="course-card-title">{course.title}</p>
                <span className="course-card-words">{course.total_words} từ</span>
            </div>
        </Link>
    );
}
