/**
 * Core combat stats: AC, initiative, speed, HP tracker, hit dice,
 * inspiration and passive perception.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function CombatStats({ character, onUpdate, readOnly }) {
    const num = (field) => (e) => onUpdate({ [field]: Number(e.target.value) });

    return (
        <section className="sheet-card combat-stats">
            <h2 className="sheet-card__title">Combat</h2>

            <div className="combat-stats__row">
                <div className="stat-box">
                    <label>Armor Class</label>
                    <input type="number" value={character.armor_class} disabled={readOnly} onChange={num('armor_class')} />
                </div>
                <div className="stat-box">
                    <label>Initiative</label>
                    <input
                        type="number"
                        value={character.initiative_bonus}
                        disabled={readOnly}
                        onChange={num('initiative_bonus')}
                    />
                </div>
                <div className="stat-box">
                    <label>Speed</label>
                    <input type="number" value={character.speed} disabled={readOnly} onChange={num('speed')} />
                </div>
                <div className="stat-box">
                    <label>Passive Perception</label>
                    <input
                        type="number"
                        value={character.passive_perception}
                        disabled={readOnly}
                        onChange={num('passive_perception')}
                    />
                </div>
            </div>

            <div className="hp-tracker">
                <div className="stat-box stat-box--wide">
                    <label>Hit Points (current / max)</label>
                    <div className="hp-tracker__inputs">
                        <input type="number" value={character.hp_current} disabled={readOnly} onChange={num('hp_current')} />
                        <span>/</span>
                        <input type="number" value={character.hp_max} disabled={readOnly} onChange={num('hp_max')} />
                    </div>
                </div>
                <div className="stat-box">
                    <label>Temp HP</label>
                    <input type="number" value={character.hp_temp} disabled={readOnly} onChange={num('hp_temp')} />
                </div>
                <div className="stat-box">
                    <label>Hit Dice</label>
                    <input
                        type="text"
                        value={character.hit_dice}
                        disabled={readOnly}
                        onChange={(e) => onUpdate({ hit_dice: e.target.value })}
                    />
                </div>
                <div className="stat-box">
                    <label>Proficiency Bonus</label>
                    <input
                        type="number"
                        value={character.proficiency_bonus}
                        disabled={readOnly}
                        onChange={num('proficiency_bonus')}
                    />
                </div>
            </div>

            <label className="inspiration-toggle">
                <input
                    type="checkbox"
                    checked={character.inspiration}
                    disabled={readOnly}
                    onChange={(e) => onUpdate({ inspiration: e.target.checked })}
                />
                Inspiration
            </label>
        </section>
    );
}
