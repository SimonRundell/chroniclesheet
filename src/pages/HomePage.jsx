import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const FEATURES = [
    {
        title: 'Live stats, no paper',
        description:
            'Ability scores, HP, AC, spell slots, inventory and currency update instantly as you play, with autosave in the background.',
    },
    {
        title: 'Your DM can watch live',
        description:
            "Share a short invite code and your DM's screen updates in real time - no more shouting your HP across the table.",
    },
    {
        title: 'A proper full sheet',
        description:
            'Saving throws, skills, death saves, features and traits, spells known - the whole character, not just the highlights.',
    },
    {
        title: 'Give your character a face',
        description: 'Upload a portrait for each character, including animated GIFs, so your table can see who they are.',
    },
    {
        title: 'Free, no catch',
        description: 'Registration is free. The site is supported by a small amount of advertising, not a subscription.',
    },
    {
        title: 'System-neutral content',
        description:
            "Built around 5e-shaped fields, but we don't bundle any of Wizards of the Coast's copyrighted rules text, spells or art - you fill the sheet with your own content.",
    },
];

/** Public landing page. */
export function HomePage() {
    usePageMeta(
        'Chronicle Sheet - Live D&D Character Tracker',
        "Chronicle Sheet is a free, live D&D character sheet: track ability scores, HP, spell slots and inventory in real time during a session, with a DM able to watch your character's status update live."
    );

    return (
        <div className="public-page">
            <section className="hero">
                <h1>Your character sheet, alive during the game.</h1>
                <p>
                    Chronicle Sheet replaces the paper sheet on your table. Track HP, spell slots and inventory as you
                    play, and let your DM watch it update in real time - all for free.
                </p>
                <div className="hero__ctas">
                    <Link to="/register" className="btn btn--primary">
                        Create a free account
                    </Link>
                    <Link to="/how-it-works" className="btn btn--ghost">
                        See how it works
                    </Link>
                </div>
            </section>

            <section className="feature-grid">
                {FEATURES.map((f) => (
                    <div className="feature-card" key={f.title}>
                        <h3>{f.title}</h3>
                        <p>{f.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
