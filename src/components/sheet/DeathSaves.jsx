const PIPS = [1, 2, 3];

/**
 * Death save success/failure trackers, three pips each.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function DeathSaves({ character, onUpdate, readOnly }) {
    const setCount = (field, pip) => {
        if (readOnly) return;
        const current = character[field];
        onUpdate({ [field]: current === pip ? pip - 1 : pip });
    };

    return (
        <section className="sheet-card death-saves">
            <h2 className="sheet-card__title">Death Saves</h2>
            <div className="death-saves__row">
                <span className="death-saves__label">Successes</span>
                {PIPS.map((pip) => (
                    <button
                        type="button"
                        key={`s${pip}`}
                        className={`death-pip death-pip--success ${
                            character.death_save_successes >= pip ? 'death-pip--filled' : ''
                        }`}
                        onClick={() => setCount('death_save_successes', pip)}
                        disabled={readOnly}
                    />
                ))}
            </div>
            <div className="death-saves__row">
                <span className="death-saves__label">Failures</span>
                {PIPS.map((pip) => (
                    <button
                        type="button"
                        key={`f${pip}`}
                        className={`death-pip death-pip--failure ${
                            character.death_save_failures >= pip ? 'death-pip--filled' : ''
                        }`}
                        onClick={() => setCount('death_save_failures', pip)}
                        disabled={readOnly}
                    />
                ))}
            </div>
        </section>
    );
}
