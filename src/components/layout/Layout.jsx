import { Link } from 'react-router-dom';
import { Header } from './Header';
import { AdSlot } from './AdSlot';

/**
 * Standard page frame: header, main content column, right-hand ad rail
 * (collapses out on narrow viewports via CSS), and a footer carrying the
 * site nav (incl. Privacy/Terms), an ad banner, and a copyright line.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function Layout({ children }) {
    return (
        <div className="app-shell">
            <Header />
            <div className="app-shell__body">
                <main className="app-shell__main">{children}</main>
                <aside className="app-shell__rail">
                    <AdSlot placement="sidebar" />
                </aside>
            </div>
            <footer className="app-shell__footer">
                <nav className="app-footer__links">
                    <Link to="/how-it-works">How It Works</Link>
                    <Link to="/faq">FAQ</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </nav>
                <AdSlot placement="footer" />
                <p className="app-footer__copyright">&copy; {new Date().getFullYear()} Chronicle Sheet</p>
            </footer>
        </div>
    );
}
