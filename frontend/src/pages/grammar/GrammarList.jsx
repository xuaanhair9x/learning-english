import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { grammarAPI } from '../../api';
import './GrammarList.css';

export default function GrammarList() {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedUnits, setExpandedUnits] = useState({});

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await grammarAPI.units();
                setUnits(res.data);

                // Expand the first unit by default
                if (res.data && res.data.length > 0) {
                    setExpandedUnits({ [res.data[0].id]: true });
                }
            } catch (err) {
                console.error('Failed to load grammar units', err);
                setError('Failed to load grammar content.');
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, []);

    const toggleUnit = (unitId) => {
        setExpandedUnits(prev => ({
            ...prev,
            [unitId]: !prev[unitId]
        }));
    };

    const handleLessonCLick = (lessonId) => {
        navigate(`/grammar/${lessonId}`);
    };

    if (loading) return <div className="page-loading">Đang tải ngữ pháp...</div>;
    if (error) return <div className="page-error">{error}</div>;

    return (
        <div className="grammar-page">
            <div className="grammar-header">
                {/* Header matching the image UI */}
                <div className="grammar-progress-tabs">
                    <button className="tab-btn active">Phần 1</button>
                    {/* Placeholder for more parts to match image */}
                </div>
            </div>

            <div className="grammar-units">
                {units.map((unit) => {
                    const isExpanded = expandedUnits[unit.id];

                    return (
                        <div key={unit.id} className="grammar-unit">
                            <div
                                className="unit-header-bar"
                                onClick={() => toggleUnit(unit.id)}
                            >
                                <div className="unit-header-info">
                                    <h3>{unit.title}</h3>
                                    <span>{unit.description}</span>
                                </div>
                                <div className="unit-header-actions">
                                    <button className="favorite-btn">⭐</button>
                                </div>
                            </div>

                            {isExpanded && unit.lessons && (
                                <div className="unit-lessons">
                                    {unit.lessons.map(lesson => (
                                        <div
                                            key={lesson.id}
                                            className="grammar-lesson-item"
                                            onClick={() => handleLessonCLick(lesson.id)}
                                        >
                                            <div className={`lesson-icon ${lesson.type === 'exercise' ? 'exercise' : 'theory'}`}>
                                                {lesson.type === 'exercise' ? '📝' : '📖'}
                                            </div>
                                            <span className="lesson-title">{lesson.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
