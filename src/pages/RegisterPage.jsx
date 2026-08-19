import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Free account registration form. */
export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', display_name: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await register(form);
            navigate('/app');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1 className="auth-card__title">Roll a New Account</h1>
                <p className="auth-card__subtitle">Free, forever. No gold pieces required.</p>

                {error && <p className="form-error">{error}</p>}

                <label className="field">
                    <span>Username</span>
                    <input name="username" value={form.username} onChange={handleChange} required autoFocus />
                </label>

                <label className="field">
                    <span>Display name</span>
                    <input name="display_name" value={form.display_name} onChange={handleChange} placeholder="Optional" />
                </label>

                <label className="field">
                    <span>Email</span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>

                <label className="field">
                    <span>Password</span>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                    />
                    <small>At least 8 characters.</small>
                </label>

                <button type="submit" className="btn btn--primary" disabled={submitting}>
                    {submitting ? 'Creating account...' : 'Create account'}
                </button>

                <p className="auth-card__footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </form>
        </div>
    );
}
