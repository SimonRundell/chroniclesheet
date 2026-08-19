import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounces calls to an async save function, exposing a status string for
 * a "Saving.../Saved" indicator. Used by the character sheet editor so
 * every keystroke doesn't trigger its own API call.
 *
 * @param {(payload: object) => Promise<any>} saveFn
 * @param {number} delayMs
 * @returns {{ status: 'idle'|'saving'|'saved'|'error', save: (payload: object) => void }}
 */
export function useDebouncedSave(saveFn, delayMs = 800) {
    const [status, setStatus] = useState('idle');
    const timerRef = useRef(null);
    const saveFnRef = useRef(saveFn);
    useEffect(() => {
        saveFnRef.current = saveFn;
    }, [saveFn]);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const save = useCallback(
        (payload) => {
            setStatus('saving');
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(async () => {
                try {
                    await saveFnRef.current(payload);
                    setStatus('saved');
                } catch (err) {
                    setStatus('error');
                }
            }, delayMs);
        },
        [delayMs]
    );

    return { status, save };
}
