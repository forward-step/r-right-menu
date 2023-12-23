import { useEffect } from 'react';
import { useRefValue } from './useRefValue';

export function useKey(
    key: string | ((ev: KeyboardEvent) => boolean),
    fn: (ev: KeyboardEvent) => void
) {
    const fnRef = useRefValue(fn);
    useEffect(() => {
        function down(ev: KeyboardEvent) {
            if (typeof key === 'function' ? key(ev) : ev.key === key) {
                fnRef.current?.(ev);
            }
        }
        window.addEventListener('keydown', down);
        return () => window.removeEventListener('keydown', down);
    }, []);
}
