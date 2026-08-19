import { usePageMeta } from '../hooks/usePageMeta';

/**
 * Privacy policy. A good-faith, plain-English description of what this
 * specific app actually does - not a substitute for legal advice.
 */
export function PrivacyPage() {
    usePageMeta(
        'Privacy Policy - Chronicle Sheet',
        'What Chronicle Sheet collects and why: account details, character data, uploaded avatars, session cookies, and how advertising cookies are used.'
    );

    return (
        <div className="public-page">
            <h1 className="page-title">Privacy Policy</h1>
            <div className="prose">
                <p>
                    This page explains what Chronicle Sheet collects and why, in plain language. It's a good-faith
                    description of what the site actually does, not a substitute for legal advice.
                </p>

                <h2>What we collect</h2>
                <ul>
                    <li>
                        <strong>Account details:</strong> username, email address, display name, and a securely
                        hashed password (we never store your actual password).
                    </li>
                    <li>
                        <strong>Character data:</strong> everything you enter on a character sheet - stats, skills,
                        spells, inventory, notes and so on.
                    </li>
                    <li>
                        <strong>Avatar images:</strong> if you upload a character portrait, the image file is stored
                        on our server under a generated filename.
                    </li>
                    <li>
                        <strong>Campaign links:</strong> which campaign (if any) a character is linked to, so a DM can
                        see it.
                    </li>
                </ul>

                <h2>Cookies</h2>
                <p>
                    We use a single session cookie to keep you logged in. It's required for the site to function and
                    isn't used for tracking or advertising.
                </p>
                <p>
                    Once advertising is enabled on this site, Google AdSense may set its own cookies to serve and
                    measure ads, and may personalise ads based on your activity, in line with{' '}
                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
                        Google's advertising policies
                    </a>
                    . Visitors in the UK/EEA will be asked for consent before any personalised advertising cookies
                    are set.
                </p>

                <h2>Who can see your data</h2>
                <p>
                    Your characters are visible only to you, and to the DM of any campaign a character is currently
                    linked to. We don't sell or share your data with third parties beyond the advertising and hosting
                    providers needed to run the site.
                </p>

                <h2>Your data, your control</h2>
                <p>
                    You can edit or delete any of your characters at any time from within the app. If you'd like your
                    account and all associated data removed entirely, contact us using the details on our{' '}
                    <a href="/terms">Terms of Service</a> page.
                </p>

                <h2>Changes to this policy</h2>
                <p>
                    If this policy changes in a meaningful way, we'll update this page and adjust the date below.
                </p>
                <p>
                    <em>Last updated: 2026.</em>
                </p>
            </div>
        </div>
    );
}
