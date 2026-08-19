/**
 * Free-text backstory/personality/session notes.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function NotesBlock({ character, onUpdate, readOnly }) {
    return (
        <section className="sheet-card notes-block">
            <h2 className="sheet-card__title">Notes</h2>
            <textarea
                rows={8}
                value={character.notes || ''}
                disabled={readOnly}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                placeholder="Backstory, personality traits, session notes..."
            />
        </section>
    );
}
