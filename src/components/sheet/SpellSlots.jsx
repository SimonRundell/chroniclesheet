import { SPELL_LEVELS } from '../../constants/dnd';

/**
 * Max/used spell slot trackers for levels 1-9.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function SpellSlots({ character, onUpdate, readOnly }) {
    const slots = character.spell_slots || {};

    const setSlot = (level, field, value) => {
        const key = String(level);
        const current = slots[key] || { max: 0, used: 0 };
        onUpdate({ spell_slots: { ...slots, [key]: { ...current, [field]: Number(value) } } });
    };

    return (
        <section className="sheet-card spell-slots">
            <h2 className="sheet-card__title">Spell Slots</h2>
            <div className="spell-slots__grid">
                {SPELL_LEVELS.map((level) => {
                    const slot = slots[String(level)] || { max: 0, used: 0 };
                    return (
                        <div className="spell-slot" key={level}>
                            <label>Lvl {level}</label>
                            <input
                                type="number"
                                min="0"
                                value={slot.used}
                                disabled={readOnly}
                                onChange={(e) => setSlot(level, 'used', e.target.value)}
                            />
                            <span>/</span>
                            <input
                                type="number"
                                min="0"
                                value={slot.max}
                                disabled={readOnly}
                                onChange={(e) => setSlot(level, 'max', e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
