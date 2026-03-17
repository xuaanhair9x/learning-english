import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ToeicConfig.css';

const PARTS = [
    { id: 1, label: 'Part 1: Mô tả tranh' },
    { id: 2, label: 'Part 2: Hỏi & Đáp' },
    { id: 3, label: 'Part 3: Hội thoại ngắn' },
    { id: 4, label: 'Part 4: Bài nói ngắn' },
    { id: 5, label: 'Part 5: Hoàn thành câu' },
    { id: 6, label: 'Part 6: Hoàn thành đoạn văn' },
    { id: 7, label: 'Part 7: Đọc hiểu đoạn văn' },
];

export default function ToeicConfig() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);

    const [realTestMode, setRealTestMode] = useState(false);
    const [fullTest, setFullTest] = useState(true);
    const [selectedParts, setSelectedParts] = useState(PARTS.map(p => p.id));
    const [timeLimit, setTimeLimit] = useState(120);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await fetch(`/api/toeic/tests/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setTest(data);
                } else {
                    setTest({ id, title: `Test ${id} ETS 2026`, duration: 120, totalQuestions: 200 });
                }
            } catch {
                setTest({ id, title: `Test ${id} ETS 2026`, duration: 120, totalQuestions: 200 });
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [id]);

    const handleRealTestToggle = (e) => {
        const checked = e.target.checked;
        setRealTestMode(checked);
        if (checked) {
            setFullTest(true);
            setSelectedParts(PARTS.map(p => p.id));
            setTimeLimit(120);
        }
    };

    const handleFullTestToggle = (e) => {
        if (realTestMode) return;
        const checked = e.target.checked;
        setFullTest(checked);
        if (checked) {
            setSelectedParts(PARTS.map(p => p.id));
        } else {
            setSelectedParts([]);
        }
    };

    const handlePartToggle = (partId) => {
        if (realTestMode) return;
        let newParts;
        if (selectedParts.includes(partId)) {
            newParts = selectedParts.filter(id => id !== partId);
        } else {
            newParts = [...selectedParts, partId];
        }
        setSelectedParts(newParts);
        setFullTest(newParts.length === PARTS.length);
    };

    const handleStart = () => {
        if (selectedParts.length === 0) return;
        navigate(`/toeic/${id}/test`, {
            state: { config: { realTestMode, selectedParts, timeLimit } }
        });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải cài đặt bộ đề...</div>;

    return (
        <div className="toeic-config-container">
            <div className="toeic-config-header">
                <button className="back-button" onClick={() => navigate(-1)}>←</button>
                <div className="test-info-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <path d="M14 2v6h6"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                        <path d="M10 9H8"></path>
                    </svg>
                </div>
                <h2 className="test-info-title">{test?.title || "Test"}</h2>
                <div className="test-info-meta">120 phút - 200 câu</div>
            </div>

            <div className="config-section">
                <div className="config-row">
                    <span className="config-label-strong">Bật chế độ thi thật</span>
                    <label className="toggle-switch">
                        <input type="checkbox" checked={realTestMode} onChange={handleRealTestToggle} />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="config-row bg-gray-50 -mx-6 px-6 py-4">
                    <label className="config-label config-label-strong">
                        <input type="checkbox" className="config-checkbox" checked={fullTest} onChange={handleFullTestToggle} disabled={realTestMode} />
                        Làm Full Test
                    </label>
                </div>

                <div className="config-row" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                    <div className="config-label-strong" style={{ marginBottom: '16px' }}>Hoặc làm từng phần</div>
                    <div className="parts-list w-full">
                        {PARTS.map(part => (
                            <label key={part.id} className="config-label" style={{ opacity: realTestMode ? 0.6 : 1 }}>
                                <input
                                    type="checkbox"
                                    className="config-checkbox"
                                    checked={selectedParts.includes(part.id)}
                                    onChange={() => handlePartToggle(part.id)}
                                    disabled={realTestMode}
                                />
                                {part.label}
                            </label>
                        ))}
                    </div>
                    <div className="parts-note">(Chọn tất cả tương đương với Làm Full Test)</div>
                </div>
            </div>

            <div className="config-section">
                <div className="config-row" style={{ borderBottom: 'none' }}>
                    <span className="config-label-strong">Thời gian làm bài</span>
                    <select
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        disabled={realTestMode}
                        style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}
                    >
                        <option value={0}>Không giới hạn</option>
                        <option value={15}>15 phút</option>
                        <option value={30}>30 phút</option>
                        <option value={45}>45 phút</option>
                        <option value={60}>60 phút</option>
                        <option value={90}>90 phút</option>
                        <option value={120}>120 phút</option>
                    </select>
                </div>
            </div>

            <div className="bottom-bar">
                <button
                    className="start-button"
                    onClick={handleStart}
                    disabled={selectedParts.length === 0}
                >
                    BẮT ĐẦU
                </button>
            </div>
        </div>
    );
}
