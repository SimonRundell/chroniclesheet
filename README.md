# Chronicle Sheet

A live D&D character sheet: track ability scores, HP, spell slots, inventory
and more during a session instead of on paper, with a nominated DM able to
watch your character's status update in real time.

This project is 5e-SRD-flavoured but ships no copyrighted Wizards of the
Coast text, art or spell/monster data - the sheet gives you the *fields*
(spells, features, inventory) and you fill in the content yourself.

## Stack

- **Frontend**: React + Vite (JavaScript), React Router, axios - at the
  project root (not a `client/` subfolder), so the whole repo is one
  npm project.
- **Backend**: plain PHP REST API (no framework), PDO - in `api/`.
- **Database**: MariaDB/MySQL.

## Local setup (Laragon)

1. **Database**: import the schema.

   ```
   mysql -u <user> -p < database/schema.sql
   ```

   This creates the `dnd_charactersheet` database and its tables.

2. **API config**: copy the sample and fill in your DB credentials.

   ```
   copy api\.config.sample.json api\.config.json
   ```

   Edit `api/.config.json` with your MariaDB host/user/password.

3. **Apache**: point Laragon's Apache document root at this project's root
   folder (`E:\dnd\charactersheet`), so that `http://localhost/api/...`
   serves the `api/` directory directly. No per-project subfolder, vhost or
   symlink is needed.

4. **Frontend config**: copy the sample.

   ```
   copy public\.config.sample.json public\.config.json
   ```

   `public/.config.json` is fetched at startup (not bundled into the build),
   so the same production build can be pointed at a different API origin,
   or have AdSense switched on, just by editing that file on the server -
   no rebuild needed.

5. **Install & run**, from the project root:

   ```
   npm install
   npm run dev
   ```

   Vite serves the React app on its own port (default `5173`); no proxy
   configuration is required since the API is called directly at
   `http://localhost/api/...`.

6. Open the Vite dev URL in your browser, register an account, and start
   building a character.

## Configuration

- `public/.config.json` - `apiBaseUrl`, DM-view poll interval
  (`pollIntervalMs`), and `adsenseClientId`. Leave `adsenseClientId` empty
  during development; the AdSense script only loads once it's set. Fetched
  at runtime (see `src/config.js`), gitignored; `public/.config.sample.json`
  is the committed template.

  Locally `apiBaseUrl` must be the full cross-port URL
  (`http://localhost/api`) since Vite and Apache run on different ports. On
  the live server, since `deploy-live.ps1` puts `api/` and the built site
  under the same host, set it to the **relative** path `"/api"` instead of
  a hardcoded domain - every API call and avatar image URL (see
  `avatarUrl()` in `src/api/client.js`) then resolves against whatever
  origin actually serves the page, and it sidesteps CORS for that request
  path entirely. This file is excluded from `deploy-live.ps1` on purpose,
  so it must be set by hand directly on the server.
- `api/.config.json` - database connection details and the session cookie
  name. Gitignored; `api/.config.sample.json` is the committed template.
  `api/.config.live.json`, if present, is a local-only reference copy of
  the live server's config - it's never read by the app and never deployed.

## How DM monitoring works

1. A DM creates a campaign from the **Campaigns** page, which generates a
   short invite code.
2. A player opens one of their characters and enters that invite code under
   "Join campaign".
3. The DM's campaign roster then polls that character's live combat stats
   (HP, AC, passive perception, etc.) every few seconds, and can open a
   read-only, auto-refreshing view of the full sheet.

A character can leave a campaign at any time from its own sheet.

## Character avatars

Players can upload a portrait image on their character sheet (click the
portrait to change it). Files are validated server-side by real content
(not file extension) against a whitelist - JPEG, PNG, GIF (including
animated), WebP and BMP - capped at 5 MB, and stored under
`api/uploads/avatars/` with a generated name (timestamp + random hex), never
the original filename. `api/uploads/.htaccess` blocks that folder from
executing any script regardless of extension, as defence in depth on top of
the content-type check. Make sure `api/uploads/avatars/` is writable by the
web server in your deployment.

## Production build & deployment

`npm run build` does two things: a normal Vite build, then a prerender pass
(`scripts/prerender.js`, using Puppeteer) that renders the public marketing
pages (`/`, `/how-it-works`, `/faq`, `/privacy`, `/terms`) to static HTML
under `dist/<route>/index.html`, so search engines and AdSense's crawler see
real content without running JavaScript. The authenticated app under `/app`
is not prerendered - it stays a normal client-rendered SPA behind login.

Deploying `dist/` as the site's document root (alongside `api/` at
`/api/...`, same as local dev) needs two things Apache provides via
`public/.htaccess` (copied into `dist/` automatically):

- Requests like `/privacy` 301-redirect to `/privacy/` so the prerendered
  `index.html` in that directory is served - this is Apache's default
  `mod_dir` behaviour, nothing extra to configure.
- A rewrite fallback sends any path that isn't a real file or directory
  (e.g. `/app/characters/5`) to `/index.html`, so React Router can render
  client-side routes on a hard refresh or direct link. Prerendered pages and
  static files (`ads.txt`, `robots.txt`, etc.) are excluded from this
  fallback and served directly.

Before going live, also replace the placeholder publisher ID in
`public/ads.txt` with your real AdSense one if you haven't already, and add
a `Sitemap:` line to `public/robots.txt` once you have a production domain.

### `deploy-live.ps1`

A gitignored PowerShell script (already filled in with real credentials for
the live DreamHost host - never commit it) that builds and uploads `api/`
and `dist/` to the live server over SFTP via WinSCP, skipping every
environment-specific config file and the avatar uploads folder so nothing
local ever overwrites what's live. Run it from the project root:

```
.\deploy-live.ps1          # build then deploy
.\deploy-live.ps1 -SkipBuild # deploy whatever's already in dist/
```

See the script's own header comment for first-time WinSCP setup.

## License

Released under Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International (CC BY-NC-SA 4.0) - see [LICENSE](LICENSE).

"Dungeons & Dragons" and "D&D" are trademarks of Wizards of the Coast LLC,
which is not affiliated with and does not endorse this project.
