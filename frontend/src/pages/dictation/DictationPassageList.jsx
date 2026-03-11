import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dictationAPI } from '../../api';
import './Dictation.css';

export default function DictationPassageList() {
    const { collectionId } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [passages, setPassages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            dictationAPI.listCollections(),
            dictationAPI.listPassages(collectionId),
        ]).then(([colRes, passRes]) => {
            const col = colRes.data.find(c => String(c.id) === String(collectionId));
            setCollection(col);
            setPassages(passRes.data);
        }).finally(() => setLoading(false));
    }, [collectionId]);

    return (
        <div className="dictation-page">
            <div className="dictation-header">
                <button className="back-link" onClick={() => navigate('/dictation')}>
                    ← Dictation
                </button>
                <h1>{collection?.icon} {collection?.title || 'Loading...'}</h1>
                <p>{collection?.description}</p>
            </div>

            <div className="passage-list">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="passage-skeleton" />)
                    : passages.map((p, i) => (
                        <div key={p.id} className="passage-card" onClick={() => navigate(`/dictation/passage/${p.id}`)}>
                            <div className="passage-num">{String(i + 1).padStart(2, '0')}</div>
                            <div className="passage-info">
                                <h3 className="passage-title">{p.title}</h3>
                                <div className="passage-meta">
                                    <span>⏱ {p.duration}</span>
                                    <span>📝 {p.total_sentences} câu</span>
                                </div>
                            </div>
                            <div className="passage-right">
                                <span className="progress-pct">Tiến độ 0%</span>
                                <button className="start-btn">BẮT ĐẦU</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
