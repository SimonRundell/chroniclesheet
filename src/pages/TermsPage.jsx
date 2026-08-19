import { usePageMeta } from '../hooks/usePageMeta';

/** Terms of Service. */
export function TermsPage() {
    usePageMeta(
        'Terms of Service - Chronicle Sheet',
        'The terms for using Chronicle Sheet: your content stays yours, acceptable use, no warranty, and how the free service may change over time.'
    );

    return (
        <div className="public-page">
            <h1 className="page-title">Terms of Service</h1>
            <div className="prose">
                <h2>The service</h2>
                <p>
                    Chronicle Sheet is a free tool for tracking Dungeons &amp; Dragons-style character sheets during
                    play. It is an independent, unofficial project and is not affiliated with or endorsed by Wizards
                    of the Coast LLC.
                </p>

                <h2>Your content</h2>
                <p>
                    You own the characters, notes and any avatar images you create or upload. We store them so the
                    site can function, and only show a character to you and to the DM of any campaign it's linked to.
                </p>

                <h2>Acceptable use</h2>
                <ul>
                    <li>Don't upload illegal, abusive or infringing content, including avatar images.</li>
                    <li>Don't attempt to access another user's account or data.</li>
                    <li>Don't scrape, automate, or overload the service in ways that degrade it for others.</li>
                </ul>
                <p>We may suspend or remove accounts that break these rules.</p>

                <h2>No warranty</h2>
                <p>
                    Chronicle Sheet is provided as-is, with no guarantee it will be available, error-free, or fit for
                    any particular purpose. As with any online tool, keep your own record of anything you can't
                    afford to lose.
                </p>

                <h2>Changes to the service</h2>
                <p>
                    Being a free, independently run project, features may change, and the service could in principle
                    be discontinued. We'll try to give reasonable notice if that ever happens.
                </p>

                <h2>Governing law</h2>
                <p>These terms are governed by the laws of England and Wales.</p>

                <h2>Contact</h2>
                <p>
                    Questions about these terms or your data can be sent to{' '}
                    <a href="mailto:simon@rundell.org.uk">simon@rundell.org.uk</a>.
                </p>
                <p>
                    <em>Last updated: 2026.</em>
                </p>
            </div>
        </div>
    );
}
