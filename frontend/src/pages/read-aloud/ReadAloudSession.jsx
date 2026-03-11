import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sentencesAPI } from '../../api';
import ReadAloudMode from './ReadAloudMode';
import ShadowingMode from './ShadowingMode';
import './ReadAloudSession.css';

export default function ReadAloudSession() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sentence, setSentence] = useState(null);
    const [total, setTotal] = useState(0);
    const [mode, setMode] = useState('read'); // 'read' | 'shadowing'

    useEffect(() => {
        window.speechSynthesis.cancel();
        setSentence(null);
        sentencesAPI.get(id).then(res => setSentence(res.data));
        sentencesAPI.list({ page: 1 }).then(res => setTotal(res.data.total || 0));
    }, [id]);

    if (!sentence) return <div className="page-loading">Đang tải...</div>;

    return (
        <div className="ra-session-page">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="ra-session-header">
                <button className="back-btn" onClick={() => { window.speechSynthesis.cancel(); navigate('/read-aloud'); }}>
                    ✕ {sentence.content.substring(0, 45)}{sentence.content.length > 45 ? '…' : ''}
                </button>
                <span className={`level-badge level-${sentence.level}`}>{sentence.level}</span>
            </div>

            {/* ── Body ───────────────────────────────────────────────── */}
            <div className="ra-session-body">
                <div className="ra-session-title">{mode === 'shadowing' ? 'Shadowing' : 'Phát âm'}</div>

                {/* Mode tabs */}
                <div className="ra-mode-tabs">
                    <button className={`mode-tab ${mode === 'read' ? 'active' : ''}`} onClick={() => { window.speechSynthesis.cancel(); setMode('read'); }}>
                        📢 Đọc to
                    </button>
                    <button className={`mode-tab ${mode === 'shadowing' ? 'active' : ''}`} onClick={() => { window.speechSynthesis.cancel(); setMode('shadowing'); }}>
                        🎭 Shadowing
                    </button>
                </div>

                {/* Content */}
                {mode === 'read' ? (
                    <ReadAloudMode sentence={sentence} id={id} total={total} />
                ) : (
                    <ShadowingMode sentence={sentence} id={id} total={total} />
                )}
            </div>
        </div>
    );
}
