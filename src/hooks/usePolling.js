import { useEffect, useRef, useState } from 'react';

/**
 * Repeatedly calls an async fetcher on an interval, exposing the latest
 * result. Used for the DM's near-real-time view of a campaign's characters.
 *
 * @param {() => Promise<any>} fetcher
 * @param {number} intervalMs
 * @returns {{ data: any, error: Error|null, loading: boolean }}
 */
export function usePolling(fetcher, intervalMs) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetcherRef = useRef(fetcher);
    useEffect(() => {
        fetcherRef.current = fetcher;
    }, [fetcher]);

    useEffect(() => {
        let cancelled = false;

        const tick = async () => {
            try {
                const result = await fetcherRef.current();
                if (!cancelled) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        tick();
        const id = setInterval(tick, intervalMs);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [intervalMs]);

    return { data, error, loading };
}
