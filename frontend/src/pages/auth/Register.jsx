import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(form.name, form.email, form.password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-voca">VOCA</span>
                    <span className="logo-prep">PREP</span>
                </div>
                <h1 className="auth-title">Tạo tài khoản</h1>
                <p className="auth-subtitle">Học tiếng Anh mỗi ngày cùng VocaPrep</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Họ và tên</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={form.name}
                            onChange={change}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={change}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Mật khẩu</label>
                        <input
                            id="reg-password"
                            name="password"
                            type="password"
                            placeholder="Tối thiểu 6 ký tự"
                            value={form.password}
                            onChange={change}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                    </button>
                </form>

                <p className="auth-switch">
                    Đã có tài khoản?{' '}
                    <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
