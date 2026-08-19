import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignsApi } from '../api/client';
import { usePolling } from '../hooks/usePolling';
import { Avatar } from '../components/common/Avatar';
import { config } from '../config';

/** DM's roster overview: campaigns run, their invite codes, and each linked character's live vitals. */
export function CampaignsPage() {
    const [overview, setOverview] = useState(null);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [creating, setCreating] = useState(false);

    const load = () => campaignsApi.list().then(setOverview);

    useEffect(() => {
        load();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCampaignName.trim()) return;
        setCreating(true);
        try {
            await campaignsApi.create({ name: newCampaignName.trim() });
            setNewCampaignName('');
            await load();
        } finally {
            setCreating(false);
        }
    };

    const handleRegenerate = async (campaignId) => {
        await campaignsApi.regenerateCode({ campaign_id: campaignId });
        await load();
    };

    if (!overview) {
        return <div className="page-loading">Loading campaigns...</div>;
    }

    return (
        <div className="campaigns-page">
            <h1 className="page-title">Campaigns</h1>

            <section className="sheet-card">
                <h2 className="sheet-card__title">Run a campaign as DM</h2>
                <form className="new-character-form" onSubmit={handleCreate}>
                    <input
                        placeholder="Campaign name..."
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                    />
                    <button type="submit" className="btn btn--primary" disabled={creating}>
                        {creating ? 'Creating...' : 'Create Campaign'}
                    </button>
                </form>

                {overview.dm_campaigns.length === 0 ? (
                    <p className="empty-state">You&apos;re not DMing any campaigns yet.</p>
                ) : (
                    overview.dm_campaigns.map((campaign) => (
                        <CampaignRoster key={campaign.id} campaign={campaign} onRegenerate={handleRegenerate} />
                    ))
                )}
            </section>

            <section className="sheet-card">
                <h2 className="sheet-card__title">Your characters linked to a campaign</h2>
                {overview.linked_characters.length === 0 ? (
                    <p className="empty-state">
                        None of your characters are linked to a campaign yet - open a character sheet and enter a
                        DM&apos;s invite code to join one.
                    </p>
                ) : (
                    <ul className="linked-character-list">
                        {overview.linked_characters.map((row) => (
                            <li key={row.character_id}>
                                <Link to={`/app/characters/${row.character_id}`}>{row.character_name}</Link>
                                <span> is playing in </span>
                                <strong>{row.campaign_name}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

/** One DM campaign card: invite code plus a live-polled roster. */
function CampaignRoster({ campaign, onRegenerate }) {
    const { data: roster, loading } = usePolling(
        () => campaignsApi.liveCharacters(campaign.id),
        config.pollIntervalMs
    );

    return (
        <div className="campaign-roster">
            <div className="campaign-roster__header">
                <h3>{campaign.name}</h3>
                <span className="invite-code">
                    Invite code: <code>{campaign.invite_code}</code>
                </span>
                <button type="button" className="btn btn--ghost btn--small" onClick={() => onRegenerate(campaign.id)}>
                    Regenerate code
                </button>
            </div>

            {loading && <p>Loading roster...</p>}

            {roster && roster.length === 0 && <p className="empty-state">No characters have joined yet.</p>}

            {roster && roster.length > 0 && (
                <table className="campaign-roster__table">
                    <thead>
                        <tr>
                            <th />
                            <th>Character</th>
                            <th>HP</th>
                            <th>AC</th>
                            <th>Passive Perception</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {roster.map((c) => (
                            <tr key={c.id}>
                                <td>
                                    <Avatar filename={c.avatar_filename} name={c.name} />
                                </td>
                                <td>
                                    {c.name}{' '}
                                    <small>
                                        ({[c.race, c.class].filter(Boolean).join(' ') || 'Adventurer'} - Level{' '}
                                        {c.level})
                                    </small>
                                </td>
                                <td className={c.hp_current <= c.hp_max / 2 ? 'hp-low' : ''}>
                                    {c.hp_current}/{c.hp_max}
                                    {c.hp_temp > 0 && ` (+${c.hp_temp})`}
                                </td>
                                <td>{c.armor_class}</td>
                                <td>{c.passive_perception}</td>
                                <td>
                                    <Link to={`/app/campaigns/${campaign.id}/characters/${c.id}`}>View sheet</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
