import { avatarUrl } from '../../api/client';

/**
 * Circular character portrait. Falls back to the character's initial when
 * no avatar has been uploaded.
 *
 * @param {{ filename: string|null, name: string, size?: 'small'|'large' }} props
 */
export function Avatar({ filename, name, size = 'small' }) {
    const url = avatarUrl(filename);

    return (
        <div className={`avatar avatar--${size}`}>
            {url ? (
                <img src={url} alt={`${name || 'Character'} avatar`} />
            ) : (
                <span className="avatar__initial">{(name || '?').charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}
