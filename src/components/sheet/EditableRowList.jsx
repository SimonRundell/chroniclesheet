/**
 * Generic add/edit/remove list used by SpellList, Inventory and Features -
 * each row is a plain object of text fields defined by `columns`. Renders
 * as a full-width grid of rows (not a scrolling table) that collapses to
 * stacked, labelled fields on narrow cards - see the
 * `.editable-row-list` container-query rules in index.css.
 *
 * @param {{
 *   items: object[],
 *   columns: { key: string, label: string, type?: 'text'|'number'|'checkbox' }[],
 *   onChange: (items: object[]) => void,
 *   readOnly: boolean,
 *   emptyRow: object,
 * }} props
 */
export function EditableRowList({ items, columns, onChange, readOnly, emptyRow }) {
    const updateRow = (index, key, value) => {
        const next = items.map((row, i) => (i === index ? { ...row, [key]: value } : row));
        onChange(next);
    };

    const removeRow = (index) => onChange(items.filter((_, i) => i !== index));
    const addRow = () => onChange([...items, { ...emptyRow }]);

    return (
        <div className={`editable-row-list editable-row-list--cols-${columns.length}`}>
            <div className="editable-row-list__header" aria-hidden="true">
                {columns.map((col) => (
                    <span key={col.key}>{col.label}</span>
                ))}
                <span />
            </div>

            {items.map((row, index) => (
                <div className="editable-row-list__row" key={index}>
                    {columns.map((col) => (
                        <div className="editable-row-list__cell" data-label={col.label} key={col.key}>
                            {col.type === 'checkbox' ? (
                                <input
                                    type="checkbox"
                                    checked={!!row[col.key]}
                                    disabled={readOnly}
                                    onChange={(e) => updateRow(index, col.key, e.target.checked)}
                                />
                            ) : (
                                <input
                                    type={col.type || 'text'}
                                    value={row[col.key] ?? ''}
                                    disabled={readOnly}
                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            col.key,
                                            col.type === 'number' ? Number(e.target.value) : e.target.value
                                        )
                                    }
                                />
                            )}
                        </div>
                    ))}
                    <div className="editable-row-list__cell editable-row-list__cell--actions">
                        {!readOnly && (
                            <button type="button" className="btn btn--icon" onClick={() => removeRow(index)}>
                                &times;
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {!readOnly && (
                <button type="button" className="btn btn--ghost btn--small" onClick={addRow}>
                    + Add row
                </button>
            )}
        </div>
    );
}
