import { NavLink } from 'react-router-dom';
import './TopNav.css';

const tabs = [
    { label: 'Đường học', path: '/', icon: '🗺️' },
    { label: 'Giải đố', path: '/quiz', icon: '🧩' },
    { label: 'Tự học', path: '/self-study', icon: '📝' },
    { label: 'Mỗi lúc', path: '/anytime', icon: '⏰' },
];

export default function TopNav() {
    return (
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
    );
}
