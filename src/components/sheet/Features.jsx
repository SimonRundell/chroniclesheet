import { EditableRowList } from './EditableRowList';

const COLUMNS = [
    { key: 'name', label: 'Feature / Feat' },
    { key: 'source', label: 'Source' },
    { key: 'description', label: 'Description' },
];

/**
 * Features, traits and feats list.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function Features({ character, onUpdate, readOnly }) {
    return (
        <section className="sheet-card features">
            <h2 className="sheet-card__title">Features &amp; Traits</h2>
            <EditableRowList
                items={character.features || []}
                columns={COLUMNS}
                onChange={(features) => onUpdate({ features })}
                readOnly={readOnly}
                emptyRow={{ name: '', source: '', description: '' }}
            />
        </section>
    );
}
