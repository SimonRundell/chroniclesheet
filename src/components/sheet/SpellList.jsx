import { EditableRowList } from './EditableRowList';

const COLUMNS = [
    { key: 'name', label: 'Spell' },
    { key: 'level', label: 'Level', type: 'number' },
    { key: 'prepared', label: 'Prepared', type: 'checkbox' },
    { key: 'notes', label: 'Notes' },
];

/**
 * Free-text spell list - players type their own spell names/levels rather
 * than picking from a bundled SRD spell database.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function SpellList({ character, onUpdate, readOnly }) {
    return (
        <section className="sheet-card spell-list">
            <h2 className="sheet-card__title">Spells Known</h2>
            <EditableRowList
                items={character.spells || []}
                columns={COLUMNS}
                onChange={(spells) => onUpdate({ spells })}
                readOnly={readOnly}
                emptyRow={{ name: '', level: 0, prepared: false, notes: '' }}
            />
        </section>
    );
}
