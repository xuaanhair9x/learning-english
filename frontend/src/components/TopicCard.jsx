import { Link } from 'react-router-dom';
import './TopicCard.css';

export default function TopicCard({ topic }) {
    return (
        <div className="topic-card">
            <div className="topic-icon-wrap" style={{ background: topic.color + '18' }}>
                <span className="topic-icon">{topic.icon}</span>
            </div>
            <div className="topic-info">
                <h4 className="topic-title">{topic.title}</h4>
                <p className="topic-desc">{topic.description}</p>
                <Link to={`/topic/${topic.id}`} className="topic-start-btn">
                    Bắt đầu →
                </Link>
            </div>
        </div>
    );
}
