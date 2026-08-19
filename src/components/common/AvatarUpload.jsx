import { useRef, useState } from 'react';
import { Avatar } from './Avatar';

/**
 * Editable avatar - click the portrait to choose a new image file, or
 * remove the current one. Any image format the browser accepts is offered
 * to the file picker; the server enforces the real whitelist.
 *
 * @param {{
 *   filename: string|null,
 *   name: string,
 *   onUpload: (file: File) => Promise<void>,
 *   onRemove: () => Promise<void>,
 * }} props
 */
export function AvatarUpload({ filename, name, onUpload, onRemove }) {
    const inputRef = useRef(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setBusy(true);
        setError('');
        try {
            await onUpload(file);
        } catch (err) {
            setError(err.response?.data?.error || 'Could not upload that image.');
        } finally {
            setBusy(false);
        }
    };

    const handleRemove = async () => {
        setBusy(true);
        setError('');
        try {
            await onRemove();
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="avatar-upload">
            <button
                type="button"
                className="avatar-upload__portrait"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                title="Change avatar"
            >
                <Avatar filename={filename} name={name} size="large" />
                <span className="avatar-upload__hint">{busy ? 'Uploading...' : 'Change'}</span>
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
            />
            {filename && (
                <button type="button" className="btn btn--ghost btn--small" onClick={handleRemove} disabled={busy}>
                    Remove avatar
                </button>
            )}
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
