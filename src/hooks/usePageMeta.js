import { useEffect } from 'react';

/**
 * Sets the document title and meta description for the current page. Used
 * by the public marketing pages so each prerendered route gets distinct,
 * crawlable metadata rather than sharing index.html's defaults.
 *
 * @param {string} title
 * @param {string} description
 */
export function usePageMeta(title, description) {
    useEffect(() => {
        document.title = title;

        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', description);
    }, [title, description]);
}
