import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { icon: '💬', label: 'Giao tiếp', path: '/communicate' },
    { icon: '📖', label: 'Bài đọc', path: '/' },
    { icon: '📢', label: 'Read Aloud', path: '/read-aloud' },
    { icon: '🎧', label: 'Dictation', path: '/dictation' },
    { icon: '📒', label: 'Ngữ pháp', path: '/grammar' },
    { icon: '⚙️', label: 'Thiết lập', path: '/settings' },
];

export default function Sidebar() {
    const location = useLocation();
    const { user, isAdmin, logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-voca">VOCA</span>
                <span className="logo-prep">PREP</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}

                {isAdmin && (
                    <Link
                        to="/admin"
                        className={`sidebar-nav-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">🛡️</span>
                        <span className="nav-label">Admin Panel</span>
                    </Link>
                )}
            </nav>

            <div className="sidebar-footer">
                {user ? (
                    <div className="sidebar-user">
                        <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <button className="logout-btn" onClick={logout}>Đăng xuất</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="login-link">Đăng nhập</Link>
                )}
            </div>
        </aside>
    );
}
