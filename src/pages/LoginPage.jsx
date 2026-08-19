import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Login form. Accepts either username or email as the identifier. */
export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login(form);
            navigate('/app');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1 className="auth-card__title">Enter the Tavern</h1>
                <p className="auth-card__subtitle">Log in to reach your characters.</p>

                {error && <p className="form-error">{error}</p>}

                <label className="field">
                    <span>Username or email</span>
                    <input name="username" value={form.username} onChange={handleChange} required autoFocus />
                </label>

                <label className="field">
                    <span>Password</span>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="btn btn--primary" disabled={submitting}>
                    {submitting ? 'Signing in...' : 'Log in'}
                </button>

                <p className="auth-card__footer">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </form>
        </div>
    );
}
