import { useNavigate, useParams } from 'react-router-dom';
import { charactersApi } from '../api/client';
import { usePolling } from '../hooks/usePolling';
import { config } from '../config';
import { Avatar } from '../components/common/Avatar';
import { AbilityScores } from '../components/sheet/AbilityScores';
import { SkillsList } from '../components/sheet/SkillsList';
import { CombatStats } from '../components/sheet/CombatStats';
import { DeathSaves } from '../components/sheet/DeathSaves';
import { SpellSlots } from '../components/sheet/SpellSlots';
import { SpellList } from '../components/sheet/SpellList';
import { Inventory } from '../components/sheet/Inventory';
import { Features } from '../components/sheet/Features';
import { NotesBlock } from '../components/sheet/NotesBlock';

/** Read-only, auto-refreshing view of a player's character for their DM. */
export function DMCharacterViewPage() {
    const { characterId } = useParams();
    const navigate = useNavigate();

    const { data: character, error } = usePolling(
        () => charactersApi.get(characterId),
        config.pollIntervalMs
    );

    if (error) {
        return <div className="page-loading">You don&apos;t have access to view this character.</div>;
    }

    if (!character) {
        return <div className="page-loading">Loading character...</div>;
    }

    const noop = () => {};

    return (
        <div className="character-sheet character-sheet--readonly">
            <div className="character-sheet__toolbar">
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/app/campaigns')}>
                    &larr; Back to campaigns
                </button>
                <span className="save-status">DM view - live, read-only</span>
            </div>

            <section className="sheet-card identity">
                <div className="identity__layout">
                    <Avatar filename={character.avatar_filename} name={character.name} size="large" />
                    <div className="identity__grid">
                        <h1 className="page-title">{character.name}</h1>
                        <p>
                            {[
                                [character.race, character.class, character.subclass && `(${character.subclass})`]
                                    .filter(Boolean)
                                    .join(' ') || 'Adventurer',
                                `Level ${character.level}`,
                                [character.background, character.alignment].filter(Boolean).join(', '),
                            ]
                                .filter(Boolean)
                                .join(' - ')}
                        </p>
                    </div>
                </div>
            </section>

            <div className="character-sheet__grid">
                <AbilityScores character={character} onUpdate={noop} readOnly />
                <CombatStats character={character} onUpdate={noop} readOnly />
                <DeathSaves character={character} onUpdate={noop} readOnly />
                <SkillsList character={character} onUpdate={noop} readOnly />
                <SpellSlots character={character} onUpdate={noop} readOnly />
                <SpellList character={character} onUpdate={noop} readOnly />
                <Inventory character={character} onUpdate={noop} readOnly />
                <Features character={character} onUpdate={noop} readOnly />
                <NotesBlock character={character} onUpdate={noop} readOnly />
            </div>
        </div>
    );
}
