import { EditableRowList } from './EditableRowList';

const COLUMNS = [
    { key: 'name', label: 'Item' },
    { key: 'qty', label: 'Qty', type: 'number' },
    { key: 'weight', label: 'Weight', type: 'number' },
    { key: 'notes', label: 'Notes' },
];

const CURRENCY_KEYS = ['cp', 'sp', 'ep', 'gp', 'pp'];

/**
 * Inventory list plus currency purse.
 *
 * @param {{ character: object, onUpdate: (patch: object) => void, readOnly: boolean }} props
 */
export function Inventory({ character, onUpdate, readOnly }) {
    const currency = character.currency || {};

    return (
        <section className="sheet-card inventory">
            <h2 className="sheet-card__title">Inventory</h2>
            <div className="currency-row">
                {CURRENCY_KEYS.map((key) => (
                    <label key={key} className="currency-row__item">
                        <span>{key.toUpperCase()}</span>
                        <input
                            type="number"
                            value={currency[key] ?? 0}
                            disabled={readOnly}
                            onChange={(e) => onUpdate({ currency: { ...currency, [key]: Number(e.target.value) } })}
                        />
                    </label>
                ))}
            </div>
            <EditableRowList
                items={character.inventory || []}
                columns={COLUMNS}
                onChange={(inventory) => onUpdate({ inventory })}
                readOnly={readOnly}
                emptyRow={{ name: '', qty: 1, weight: 0, notes: '' }}
            />
        </section>
    );
}
