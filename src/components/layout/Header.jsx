import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Top navigation bar shown on every page once past login/register. */
export function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <Link to={user ? '/app' : '/'} className="app-header__brand">
                <span className="app-header__crest">&#9876;</span>
                Chronicle Sheet
            </Link>
            {user ? (
                <nav className="app-header__nav">
                    <Link to="/app">My Characters</Link>
                    <Link to="/app/campaigns">Campaigns</Link>
                    <span className="app-header__user">{user.display_name}</span>
                    <button type="button" className="btn btn--ghost" onClick={handleLogout}>
                        Log out
                    </button>
                </nav>
            ) : (
                <nav className="app-header__nav">
                    <Link to="/how-it-works">How It Works</Link>
                    <Link to="/faq">FAQ</Link>
                    <Link to="/login">Log in</Link>
                    <Link to="/register" className="btn btn--primary btn--small">
                        Sign up free
                    </Link>
                </nav>
            )}
        </header>
    );
}
