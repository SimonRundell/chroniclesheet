/**
 * Post-build step: renders each public marketing route with headless
 * Chrome and writes the resulting HTML into dist/, so crawlers (including
 * AdSense's Mediapartners-Google) see real page content without having to
 * execute JavaScript. The authenticated app under /app stays a pure
 * client-rendered SPA - only the public pages need this.
 */
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_ROUTES = ['/', '/how-it-works', '/faq', '/privacy', '/terms'];
const OUT_DIR = path.dirname(fileURLToPath(import.meta.url)) + '/../dist';

async function main() {
    const server = await preview({ preview: { port: 4173, open: false }, logLevel: 'silent' });
    const baseUrl = server.resolvedUrls.local[0];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const route of PUBLIC_ROUTES) {
        const url = new URL(route, baseUrl).toString();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.public-page', { timeout: 10000 });

        const html = await page.content();
        const outPath =
            route === '/' ? path.join(OUT_DIR, 'index.html') : path.join(OUT_DIR, route.slice(1), 'index.html');

        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html);
        console.log(`Prerendered ${route} -> ${path.relative(process.cwd(), outPath)}`);
    }

    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
}

main().catch((err) => {
    console.error('Prerender failed:', err);
    process.exit(1);
});
