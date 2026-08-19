/**
 * Runtime app configuration, fetched from /.config.json at startup rather
 * than imported as a JS module - this lets the same production build be
 * pointed at a different API origin (or have AdSense switched on) purely by
 * editing that file on the server, with no rebuild. See loadConfig() in
 * main.jsx for where this gets populated before the app renders.
 *
 * `.config.json` is gitignored (per-environment, real values);
 * `.config.sample.json` is the committed template.
 *
 * @type {{ apiBaseUrl: string, pollIntervalMs: number, adsenseClientId: string }}
 */
export const config = {
    apiBaseUrl: '',
    pollIntervalMs: 5000,
    adsenseClientId: '',
};

/**
 * Fetches /.config.json and merges it into the shared config object. Must
 * be awaited before anything that reads `config` (API calls, ad script
 * loading) runs.
 *
 * @returns {Promise<void>}
 */
export async function loadConfig() {
    const response = await fetch('/.config.json');
    const data = await response.json();
    Object.assign(config, data);
}
