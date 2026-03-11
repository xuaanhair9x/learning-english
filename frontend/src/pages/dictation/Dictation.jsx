import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dictationAPI } from '../../api';
import './Dictation.css';

export default function Dictation() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        dictationAPI.listCollections()
            .then(r => setCollections(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="dictation-page">
            <div className="dictation-header">
                <h1>🎧 Dictation</h1>
                <p>Nghe và điền từ vào chỗ trống — luyện kỹ năng nghe chép chính tả</p>
            </div>

            <div className="dictation-grid">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="collection-skeleton" />)
                    : collections.map(col => (
                        <div
                            key={col.id}
                            className="collection-card"
                            onClick={() => navigate(`/dictation/${col.id}`)}
                            style={{ '--col-color': col.color }}
                        >
                            <div className="collection-icon">{col.icon}</div>
                            <div className="collection-body">
                                <h3 className="collection-title">{col.title}</h3>
                                <p className="collection-desc">{col.description}</p>
                                <div className="collection-meta">
                                    <span className="meta-badge">{col.passage_count} bài</span>
                                </div>
                            </div>
                            <button className="collection-btn">Luyện tập →</button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
