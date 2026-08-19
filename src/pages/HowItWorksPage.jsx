import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const STEPS = [
    {
        title: 'Create a free account',
        description: 'Just a username, email and password. No payment details, ever.',
    },
    {
        title: 'Roll up a character',
        description:
            'Give them a name and start filling in the sheet - race, class, ability scores, skills, spells, inventory, whatever you need.',
    },
    {
        title: 'Play with it open',
        description:
            'Adjust HP, use a spell slot, pick up loot - every change saves automatically a moment after you stop typing.',
    },
    {
        title: 'Link up with your DM',
        description:
            "If your DM has a Chronicle Sheet campaign, enter their invite code on your character's sheet to link the two.",
    },
    {
        title: 'Your DM watches live',
        description:
            'Once linked, your DM sees your HP, AC and other vitals update on their own screen within a few seconds, and can open your full sheet read-only.',
    },
];

/** Explains the player and DM workflow. */
export function HowItWorksPage() {
    usePageMeta(
        'How It Works - Chronicle Sheet',
        'How Chronicle Sheet works: create a character, play with your stats live, and link up with your DM using an invite code so they can watch your character update in real time.'
    );

    return (
        <div className="public-page">
            <section>
                <h1 className="page-title">How It Works</h1>
                <ol className="steps-list">
                    {STEPS.map((step) => (
                        <li key={step.title}>
                            <div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="hero">
                <Link to="/register" className="btn btn--primary">
                    Get started for free
                </Link>
            </section>
        </div>
    );
}
