import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [displayLang, setDisplayLang] = useState('Tiếng Việt');
    const [studyLang, setStudyLang] = useState('Tiếng Việt');
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-empty">
                    <span className="profile-empty-icon">👤</span>
                    <p>Bạn chưa đăng nhập</p>
                    <button className="profile-login-btn" onClick={() => navigate('/login')}>Đăng nhập</button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {/* ── User Header ───────────────────────────────────── */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.avatar || user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-user-info">
                    <h1 className="profile-name">{user.name}</h1>
                    <span className="profile-email">{user.email}</span>
                </div>
                <button className="profile-edit-btn" title="Chỉnh sửa">✏️</button>
            </div>

            {/* ── Settings ──────────────────────────────────────── */}
            <section className="profile-section">
                <h2 className="profile-section-title">Thiết lập</h2>

                <div className="setting-row">
                    <div className="setting-label">
                        <span className="setting-icon">🌐</span>
                        <span>Ngôn ngữ hiển thị</span>
                    </div>
                    <select className="setting-select" value={displayLang} onChange={e => setDisplayLang(e.target.value)}>
                        <option>Tiếng Việt</option>
                        <option>English</option>
                    </select>
                </div>

                <div className="setting-row">
                    <div className="setting-label">
                        <span className="setting-icon">📖</span>
                        <div className="setting-label-text">
                            <span>Ngôn ngữ mục đề</span>
                            <span className="setting-hint">Hiển dung trên bài học, ghi chú & bản dịch và tiêu đề. Mọi ngôn ngữ mục đề.</span>
                        </div>
                    </div>
                    <select className="setting-select" value={studyLang} onChange={e => setStudyLang(e.target.value)}>
                        <option>Tiếng Việt</option>
                        <option>English</option>
                    </select>
                </div>

                <div className="setting-row">
                    <div className="setting-label">
                        <span className="setting-icon">🌙</span>
                        <span>Chế độ tối</span>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </section>

            {/* ── Support ───────────────────────────────────────── */}
            <section className="profile-section">
                <h2 className="profile-section-title">Hỗ trợ</h2>

                <a href="#" className="support-row">
                    <span className="setting-icon">📊</span>
                    <span>Thống kê sử dụng</span>
                </a>
                <a href="#" className="support-row">
                    <span className="setting-icon">📋</span>
                    <span>Bảng đề / đáp ý</span>
                </a>
                <a href="#" className="support-row">
                    <span className="setting-icon">⭐</span>
                    <span>Đánh giá ứng dụng</span>
                </a>
                <a href="#" className="support-row">
                    <span className="setting-icon">🔗</span>
                    <span>Chia sẻ với bạn bè</span>
                </a>
                <a href="#" className="support-row">
                    <span className="setting-icon">✉️</span>
                    <span>Liên hệ</span>
                </a>
                <div className="support-row version">
                    <span className="setting-icon">ℹ️</span>
                    <span>Phiên bản</span>
                    <span className="version-number">1.0.0</span>
                </div>
            </section>

            {/* ── Actions ───────────────────────────────────────── */}
            <div className="profile-actions">
                <button className="logout-action" onClick={handleLogout}>Đăng xuất</button>
            </div>
        </div>
    );
}
