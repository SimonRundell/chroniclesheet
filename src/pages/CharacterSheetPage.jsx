import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignsApi, charactersApi } from '../api/client';
import { useDebouncedSave } from '../hooks/useDebouncedSave';
import { AvatarUpload } from '../components/common/AvatarUpload';
import { AbilityScores } from '../components/sheet/AbilityScores';
import { SkillsList } from '../components/sheet/SkillsList';
import { CombatStats } from '../components/sheet/CombatStats';
import { DeathSaves } from '../components/sheet/DeathSaves';
import { SpellSlots } from '../components/sheet/SpellSlots';
import { SpellList } from '../components/sheet/SpellList';
import { Inventory } from '../components/sheet/Inventory';
import { Features } from '../components/sheet/Features';
import { NotesBlock } from '../components/sheet/NotesBlock';

const IDENTITY_FIELDS = [
    { key: 'name', label: 'Character Name' },
    { key: 'race', label: 'Race' },
    { key: 'class', label: 'Class' },
    { key: 'subclass', label: 'Subclass' },
    { key: 'background', label: 'Background' },
    { key: 'alignment', label: 'Alignment' },
];

/** The full editable character sheet for the owning player. */
export function CharacterSheetPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [inviteCode, setInviteCode] = useState('');
    const [campaignMessage, setCampaignMessage] = useState('');

    const { status, save } = useDebouncedSave((patch) => charactersApi.update(id, patch));

    useEffect(() => {
        charactersApi.get(id).then(setCharacter);
    }, [id]);

    const updateField = useCallback(
        (patch) => {
            setCharacter((prev) => ({ ...prev, ...patch }));
            save(patch);
        },
        [save]
    );

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${character.name}? This cannot be undone.`)) return;
        await charactersApi.remove(id);
        navigate('/app');
    };

    const handleJoinCampaign = async (e) => {
        e.preventDefault();
        setCampaignMessage('');
        try {
            const result = await campaignsApi.join({ character_id: Number(id), invite_code: inviteCode.trim() });
            setCharacter((prev) => ({ ...prev, campaign_id: result.campaign_id, campaign_name: result.campaign_name }));
            setInviteCode('');
        } catch (err) {
            setCampaignMessage(err.response?.data?.error || 'Could not join that campaign.');
        }
    };

    const handleLeaveCampaign = async () => {
        await campaignsApi.leave({ character_id: Number(id) });
        setCharacter((prev) => ({ ...prev, campaign_id: null, campaign_name: null }));
    };

    const handleAvatarUpload = async (file) => {
        const result = await charactersApi.uploadAvatar(id, file);
        setCharacter((prev) => ({ ...prev, avatar_filename: result.avatar_filename }));
    };

    const handleAvatarRemove = async () => {
        await charactersApi.removeAvatar(id);
        setCharacter((prev) => ({ ...prev, avatar_filename: null }));
    };

    if (!character) {
        return <div className="page-loading">Loading character...</div>;
    }

    return (
        <div className="character-sheet">
            <div className="character-sheet__toolbar">
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/app')}>
                    &larr; Back to characters
                </button>
                <span className={`save-status save-status--${status}`}>
                    {status === 'saving' && 'Saving...'}
                    {status === 'saved' && 'Saved'}
                    {status === 'error' && 'Save failed'}
                </span>
                <button type="button" className="btn btn--danger btn--small" onClick={handleDelete}>
                    Delete character
                </button>
            </div>

            <section className="sheet-card identity">
                <div className="identity__layout">
                    <AvatarUpload
                        filename={character.avatar_filename}
                        name={character.name}
                        onUpload={handleAvatarUpload}
                        onRemove={handleAvatarRemove}
                    />
                    <div className="identity__grid">
                        {IDENTITY_FIELDS.map(({ key, label }) => (
                            <label key={key} className="field">
                                <span>{label}</span>
                                <input
                                    value={character[key] || ''}
                                    onChange={(e) => updateField({ [key]: e.target.value })}
                                />
                            </label>
                        ))}
                        <label className="field field--narrow">
                            <span>Level</span>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={character.level}
                                onChange={(e) => updateField({ level: Number(e.target.value) })}
                            />
                        </label>
                        <label className="field field--narrow">
                            <span>XP</span>
                            <input
                                type="number"
                                min="0"
                                value={character.experience_points}
                                onChange={(e) => updateField({ experience_points: Number(e.target.value) })}
                            />
                        </label>
                    </div>
                </div>

                <div className="campaign-link">
                    {character.campaign_id ? (
                        <div className="campaign-link__active">
                            <span>Linked to a campaign - your DM can see this character&apos;s live status.</span>
                            <button type="button" className="btn btn--ghost btn--small" onClick={handleLeaveCampaign}>
                                Leave campaign
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleJoinCampaign} className="campaign-link__join">
                            <input
                                placeholder="DM's invite code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                            />
                            <button type="submit" className="btn btn--ghost btn--small">
                                Join campaign
                            </button>
                            {campaignMessage && <span className="form-error">{campaignMessage}</span>}
                        </form>
                    )}
                </div>
            </section>

            <div className="character-sheet__grid">
                <AbilityScores character={character} onUpdate={updateField} readOnly={false} />
                <CombatStats character={character} onUpdate={updateField} readOnly={false} />
                <DeathSaves character={character} onUpdate={updateField} readOnly={false} />
                <SkillsList character={character} onUpdate={updateField} readOnly={false} />
                <SpellSlots character={character} onUpdate={updateField} readOnly={false} />
                <SpellList character={character} onUpdate={updateField} readOnly={false} />
                <Inventory character={character} onUpdate={updateField} readOnly={false} />
                <Features character={character} onUpdate={updateField} readOnly={false} />
                <NotesBlock character={character} onUpdate={updateField} readOnly={false} />
            </div>
        </div>
    );
}
