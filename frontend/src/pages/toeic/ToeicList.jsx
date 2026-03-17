import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ToeicList.css';

// mock data fallback
const MOCK_DATA = [
    { id: 1, title: 'Test 1 ETS 2026', publisher: 'ETS 2026' },
    { id: 2, title: 'Test 2 ETS 2026', publisher: 'ETS 2026' },
    { id: 3, title: 'Test 3 ETS 2026', publisher: 'ETS 2026' },
    { id: 4, title: 'Test 4 ETS 2026', publisher: 'ETS 2026' },
    { id: 5, title: 'Test 5 ETS 2026', publisher: 'ETS 2026' },
    { id: 6, title: 'Test 6 ETS 2026', publisher: 'ETS 2026' },
    { id: 7, title: 'Test 7 ETS 2026', publisher: 'ETS 2026' },
    { id: 8, title: 'Test 8 ETS 2026', publisher: 'ETS 2026' },
    { id: 9, title: 'Test 1 YBM 2025', publisher: 'YBM 2025' },
    { id: 10, title: 'Test 2 YBM 2025', publisher: 'YBM 2025' },
    { id: 11, title: 'Test 3 YBM 2025', publisher: 'YBM 2025' },
    { id: 12, title: 'Test 4 YBM 2025', publisher: 'YBM 2025' },
];

const DocumentEditIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <path d="M14 2v6h6"></path>
        <path d="M16 13H8"></path>
        <path d="M16 17H8"></path>
        <path d="M10 9H8"></path>
        <path d="M14 11l4-4 2 2-4 4"></path>
    </svg>
);

export default function ToeicList() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                // Try fetching from API
                const res = await fetch('/api/toeic/tests', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token') // Assuming auth is like this
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setTests(data);
                    } else {
                        setTests(MOCK_DATA);
                    }
                } else {
                    setTests(MOCK_DATA);
                }
            } catch (error) {
                console.error("Failed to fetch tests:", error);
                setTests(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    // Group by publisher
    const grouped = tests.reduce((acc, test) => {
        const key = test.publisher || 'Unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(test);
        return acc;
    }, {});

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="toeic-list-container">
            <div className="toeic-list-header">
                <h1 className="toeic-list-title">Danh Sách Bộ Đề</h1>
            </div>

            {Object.entries(grouped).map(([publisher, publisherTests]) => (
                <div key={publisher} className="publisher-group">
                    <div className="publisher-header">
                        <div className="publisher-title">
                            <span className="icon">📚</span>
                            {publisher} | {publisherTests.length}
                        </div>
                        <a href="#" className="view-more">Xem thêm</a>
                    </div>
                    <div className="test-grid">
                        {publisherTests.map(test => (
                            <Link key={test.id} to={`/toeic/${test.id}/config`} className="test-card">
                                <div className="test-card-badge"></div>
                                <div className="test-icon-wrapper">
                                    <DocumentEditIcon />
                                </div>
                                <div className="test-card-title">{test.title}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
