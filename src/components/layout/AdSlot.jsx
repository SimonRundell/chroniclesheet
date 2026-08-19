import { config } from '../../config';

/**
 * Reserved advertising space. Renders a clearly-labelled placeholder in
 * local dev; once .config.json's adsenseClientId is set and the AdSense
 * script is loaded (see main.jsx), this can be swapped for a real
 * <ins class="adsbygoogle"> unit without changing any layout code.
 *
 * @param {{ placement: 'sidebar'|'footer' }} props
 */
export function AdSlot({ placement }) {
    return (
        <div className={`ad-slot ad-slot--${placement}`} aria-label="Advertisement">
            {config.adsenseClientId ? null : <span className="ad-slot__placeholder">Ad space</span>}
        </div>
    );
}
