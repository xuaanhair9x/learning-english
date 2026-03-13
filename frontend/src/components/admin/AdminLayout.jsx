import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
    const { user, isAdmin, logout } = useAuth();
    const location = useLocation();

    if (!isAdmin) {
        return (
            <div className="admin-forbidden">
                <h1>403 Forbidden</h1>
                <p>You do not have permission to view this page.</p>
                <Link to="/">Return to Home</Link>
            </div>
        );
    }

    const navLinks = [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/courses', label: 'Courses' },
        { path: '/admin/lessons', label: 'Lessons' },
        { path: '/admin/vocabulary', label: 'Vocabulary' },
        { path: '/admin/topics', label: 'Topics' },
        { path: '/admin/sentences', label: 'Sentences' },
        { path: '/admin/dictation-collections', label: 'Dictation Collections' },
        { path: '/admin/dictation-passages', label: 'Dictation Passages' },
        { path: '/admin/dictation-exercises', label: 'Dictation Exercises' },
        { path: '/admin/grammar-units', label: 'Grammar Units' },
        { path: '/admin/grammar-lessons', label: 'Grammar Lessons' },
        { path: '/admin/grammar-exercises', label: 'Grammar Exercises' },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`admin-nav-item ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <span>{user?.name}</span>
                        <span className="badge">Admin</span>
                    </div>
                    <button onClick={logout} className="admin-logout-btn">Logout</button>
                    <Link to="/" className="admin-home-btn">Go to App</Link>
                </div>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
