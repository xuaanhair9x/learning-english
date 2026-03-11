import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sentencesAPI } from '../api';
import './ReadAloud.css';

const LEVELS = [
    { value: '', label: 'Tất cả' },
    { value: 'basic', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung cấp' },
    { value: 'advanced', label: 'Nâng cao' },
];

const TOPICS = [
    { value: '', label: 'Tất cả chủ đề' },
    { value: 'daily', label: 'Hàng ngày' },
    { value: 'business', label: 'Kinh doanh' },
    { value: 'travel', label: 'Du lịch' },
    { value: 'technology', label: 'Công nghệ' },
];

export default function ReadAloud() {
    const [sentences, setSentences] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [level, setLevel] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await sentencesAPI.list({ page, level, topic });
                setSentences(res.data.data || []);
                setTotal(res.data.total || 0);
                setPages(res.data.pages || 1);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, [page, level, topic]);

    const handleFilter = (type, value) => {
        setPage(1);
        if (type === 'level') setLevel(value);
        else setTopic(value);
    };

    const speakSentence = (text, e) => {
        e.stopPropagation();
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
    };

    return (
        <div className="read-aloud-page">
            <div className="read-aloud-header">
                <h1>📢 Read Aloud</h1>
                <p>Luyện phát âm với {total} câu thực hành</p>
            </div>

            {/* ── Filters ─────────────────────────────────────────────── */}
            <div className="ra-filters">
                <div className="filter-group">
                    {LEVELS.map(l => (
                        <button
                            key={l.value}
                            className={`filter-chip ${level === l.value ? 'active' : ''}`}
                            onClick={() => handleFilter('level', l.value)}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
                <div className="filter-group">
                    {TOPICS.map(t => (
                        <button
                            key={t.value}
                            className={`filter-chip ${topic === t.value ? 'active' : ''}`}
                            onClick={() => handleFilter('topic', t.value)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Sentence List ────────────────────────────────────────── */}
            <div className="ra-list">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="ra-skeleton" />
                    ))
                ) : (
                    sentences.map((s, idx) => (
                        <div
                            key={s.id}
                            className="ra-sentence-row"
                            onClick={() => navigate(`/read-aloud/${s.id}`)}
                        >
                            <div className="ra-number">{(page - 1) * 20 + idx + 1}</div>
                            <div className="ra-text-wrap">
                                <p className="ra-sentence">{s.content}</p>
                                <p className="ra-vi">{s.vietnamese}</p>
                            </div>
                            <div className="ra-row-actions">
                                <button
                                    className="ra-listen-btn"
                                    title="Nghe phát âm mẫu"
                                    onClick={(e) => speakSentence(s.content, e)}
                                >
                                    🔊
                                </button>
                                <span className={`level-badge level-${s.level}`}>{s.level}</span>
                                <span className="ra-arrow">›</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Pagination ───────────────────────────────────────────── */}
            {pages > 1 && (
                <div className="ra-pagination">
                    <button
                        className="page-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >‹</button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            className={`page-btn ${page === p ? 'active' : ''}`}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        className="page-btn"
                        disabled={page === pages}
                        onClick={() => setPage(p => p + 1)}
                    >›</button>
                </div>
            )}
        </div>
    );
}
