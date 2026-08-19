import { usePageMeta } from '../hooks/usePageMeta';

const FAQS = [
    {
        q: 'Is Chronicle Sheet really free?',
        a: 'Yes. Registration and every feature on the site are free. The service is supported by a small amount of advertising rather than a subscription.',
    },
    {
        q: 'Is this official Dungeons & Dragons content?',
        a: "No. Chronicle Sheet is an independent, unofficial tool. It gives you the fields a 5e-shaped character sheet needs, but doesn't include any of Wizards of the Coast's copyrighted rules text, spell descriptions, monster stats or artwork - you fill those in yourself. \"Dungeons & Dragons\" and \"D&D\" are trademarks of Wizards of the Coast LLC, which is not affiliated with this site.",
    },
    {
        q: 'Which edition does it support?',
        a: 'The sheet is shaped around 5th edition mechanics (ability scores, proficiency bonus, spell slots by level, and so on), but since content fields are free text, it can flex to fit homebrew or other editions reasonably well too.',
    },
    {
        q: 'Can one account be both a player and a DM?',
        a: "Yes. Every account can create its own characters and also run campaigns as a DM. There's no separate account type.",
    },
    {
        q: "How does my DM see my character?",
        a: "A DM creates a campaign, which generates a short invite code. You enter that code against one of your characters, and your DM's campaign page then shows that character's live status - no email invites or friend requests needed.",
    },
    {
        q: 'What image formats can I use for a character avatar?',
        a: 'JPEG, PNG, GIF (including animated GIFs), WebP and BMP, up to 5 MB.',
    },
    {
        q: 'Is my character data private?',
        a: "Your characters are visible only to you, plus the DM of any campaign you've linked a character to. See our Privacy Policy for the full detail.",
    },
];

/** Frequently asked questions. */
export function FaqPage() {
    usePageMeta(
        'FAQ - Chronicle Sheet',
        'Frequently asked questions about Chronicle Sheet: pricing, D&D edition support, how DM monitoring works, avatar uploads and data privacy.'
    );

    return (
        <div className="public-page">
            <h1 className="page-title">Frequently Asked Questions</h1>
            <div className="faq-list">
                {FAQS.map((item) => (
                    <div className="faq-item" key={item.q}>
                        <h3>{item.q}</h3>
                        <p>{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
