import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TopNav.css';

const tabs = [
    { label: 'Đường học', path: '/', icon: '🗺️' },
    { label: 'Giải đố', path: '/quiz', icon: '🧩' },
    { label: 'Tự học', path: '/self-study', icon: '📝' },
    { label: 'Mỗi lúc', path: '/anytime', icon: '⏰' },
];

export default function TopNav() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="top-nav-wrapper">
            <nav className="top-nav">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        end={tab.path === '/'}
                        className={({ isActive }) => `top-nav-tab ${isActive ? 'active' : ''}`}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="top-nav-actions">
                <button className="top-action-btn" title="Thông báo">🔔</button>
                <button
                    className="top-account-btn"
                    onClick={() => navigate('/profile')}
                    title="Tài khoản"
                >
                    <span className="account-avatar">
                        {user ? (user.avatar || user.name?.charAt(0).toUpperCase()) : '👤'}
                    </span>
                    <span className="account-label">Hồ sơ</span>
                </button>
            </div>
        </div>
    );
}
