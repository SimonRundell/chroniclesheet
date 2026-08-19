import { ABILITIES } from '../../constants/dnd';
import { abilityModifier, formatModifier } from '../../utils/dnd';

/**
 * The six ability score boxes with their computed modifiers.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function AbilityScores({ character, onUpdate, readOnly }) {
    return (
        <section className="sheet-card ability-scores">
            <h2 className="sheet-card__title">Ability Scores</h2>
            <div className="ability-scores__grid">
                {ABILITIES.map(({ key, label }) => {
                    const score = character[`ability_${key}`];
                    return (
                        <div className="ability-box" key={key}>
                            <label className="ability-box__label">{label}</label>
                            <div className="ability-box__mod">{formatModifier(abilityModifier(score))}</div>
                            <input
                                type="number"
                                className="ability-box__score"
                                value={score}
                                disabled={readOnly}
                                onChange={(e) => onUpdate({ [`ability_${key}`]: Number(e.target.value) })}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
