import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { charactersApi } from '../api/client';
import { Avatar } from '../components/common/Avatar';

/** Lists the logged-in player's own characters and lets them start a new one. */
export function DashboardPage() {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    const load = () => charactersApi.list().then(setCharacters).finally(() => setLoading(false));

    useEffect(() => {
        load();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setCreating(true);
        try {
            const character = await charactersApi.create({ name: newName.trim() });
            navigate(`/app/characters/${character.id}`);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="dashboard">
            <h1 className="page-title">My Characters</h1>

            <form className="new-character-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="New character name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit" className="btn btn--primary" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Character'}
                </button>
            </form>

            {loading ? (
                <p>Loading your characters...</p>
            ) : characters.length === 0 ? (
                <p className="empty-state">No characters yet - roll one up above to get started.</p>
            ) : (
                <ul className="character-card-list">
                    {characters.map((c) => (
                        <li key={c.id}>
                            <Link to={`/app/characters/${c.id}`} className="character-card">
                                <Avatar filename={c.avatar_filename} name={c.name} />
                                <div className="character-card__body">
                                    <h3>{c.name}</h3>
                                    <p>
                                        {c.race || 'Unknown race'} {c.class || 'Adventurer'} - Level {c.level}
                                    </p>
                                    <div className="character-card__stats">
                                        <span>HP {c.hp_current}/{c.hp_max}</span>
                                        <span>AC {c.armor_class}</span>
                                        {c.campaign_id && <span className="badge">In campaign</span>}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
