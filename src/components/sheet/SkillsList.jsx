import { ABILITIES, SKILLS } from '../../constants/dnd';
import { abilityModifier, formatModifier } from '../../utils/dnd';

const PROFICIENCY_CYCLE = [0, 1, 2]; // none -> proficient -> expertise -> none

/**
 * Skills list with a cyclable proficiency marker, and the six saving throw
 * proficiency checkboxes.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function SkillsList({ character, onUpdate, readOnly }) {
    const skills = character.skills || {};
    const savingThrows = character.saving_throw_proficiencies || [];
    const profBonus = character.proficiency_bonus;

    const cycleSkill = (key) => {
        if (readOnly) return;
        const current = skills[key] || 0;
        const next = PROFICIENCY_CYCLE[(PROFICIENCY_CYCLE.indexOf(current) + 1) % PROFICIENCY_CYCLE.length];
        onUpdate({ skills: { ...skills, [key]: next } });
    };

    const toggleSave = (key) => {
        if (readOnly) return;
        const has = savingThrows.includes(key);
        const next = has ? savingThrows.filter((k) => k !== key) : [...savingThrows, key];
        onUpdate({ saving_throw_proficiencies: next });
    };

    return (
        <section className="sheet-card skills-list">
            <h2 className="sheet-card__title">Saving Throws</h2>
            <ul className="saves-list">
                {ABILITIES.map(({ key, label }) => {
                    const proficient = savingThrows.includes(key);
                    const bonus = abilityModifier(character[`ability_${key}`]) + (proficient ? profBonus : 0);
                    return (
                        <li key={key}>
                            <button
                                type="button"
                                className={`proficiency-dot ${proficient ? 'proficiency-dot--full' : ''}`}
                                onClick={() => toggleSave(key)}
                                disabled={readOnly}
                                aria-label={`${label} saving throw proficiency`}
                            />
                            <span className="saves-list__bonus">{formatModifier(bonus)}</span>
                            <span className="saves-list__label">{label}</span>
                        </li>
                    );
                })}
            </ul>

            <h2 className="sheet-card__title">Skills</h2>
            <ul className="skills-list__items">
                {SKILLS.map(({ key, label, ability }) => {
                    const level = skills[key] || 0;
                    const bonus = abilityModifier(character[`ability_${ability}`]) + level * profBonus;
                    return (
                        <li key={key}>
                            <button
                                type="button"
                                className={`proficiency-dot ${
                                    level === 1 ? 'proficiency-dot--full' : level === 2 ? 'proficiency-dot--double' : ''
                                }`}
                                onClick={() => cycleSkill(key)}
                                disabled={readOnly}
                                aria-label={`${label} proficiency`}
                            />
                            <span className="skills-list__bonus">{formatModifier(bonus)}</span>
                            <span className="skills-list__label">
                                {label} <small>({ability})</small>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
