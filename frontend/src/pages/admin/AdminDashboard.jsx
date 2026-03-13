import { useEffect, useState } from 'react';
import api from '../../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        vocabulary: 0,
        sentences: 0,
        grammarUnits: 0,
        grammarLessons: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch simply length for each array as a basic dashboard stats
                const [uRes, cRes, vRes, sRes, guRes, glRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/admin/courses'),
                    api.get('/admin/vocabulary'),
                    api.get('/admin/sentences'),
                    api.get('/admin/grammar-units'),
                    api.get('/admin/grammar-lessons'),
                ]);

                setStats({
                    users: uRes.data.length || 0,
                    courses: cRes.data.length || 0,
                    vocabulary: vRes.data.length || 0,
                    sentences: sRes.data.length || 0,
                    grammarUnits: guRes.data.length || 0,
                    grammarLessons: glRes.data.length || 0,
                });
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <h3>Total Users</h3>
                    <p className="admin-stat-number">{stats.users}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Total Courses</h3>
                    <p className="admin-stat-number">{stats.courses}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Total Vocabulary</h3>
                    <p className="admin-stat-number">{stats.vocabulary}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Total Sentences</h3>
                    <p className="admin-stat-number">{stats.sentences}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Grammar Units</h3>
                    <p className="admin-stat-number">{stats.grammarUnits}</p>
                </div>
                <div className="admin-stat-card">
                    <h3>Grammar Lessons</h3>
                    <p className="admin-stat-number">{stats.grammarLessons}</p>
                </div>
            </div>
            <div className="admin-welcome-box">
                <h2>Welcome to the Admin Panel</h2>
                <p>Use the sidebar to navigate and manage all application data. The Generic CRUD system handles Users, Courses, Lessons, Vocabulary, Topics, Sentences, and Dictations directly.</p>
            </div>
        </div>
    );
}
