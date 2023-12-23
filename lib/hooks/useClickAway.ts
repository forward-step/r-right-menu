import { useEffect } from 'react';
import { useRefValue } from './useRefValue';

export function useClickAway(clsname: string, onClick: () => void, enabled: boolean) {
    const onClickRef = useRefValue(onClick);
    useEffect(() => {
        if(!enabled) return;

        function mousedown(ev: MouseEvent) {
            for (const el of Array.from(document.querySelectorAll(clsname))) {
                if (el.contains(ev.target as Node)) {
                    return;
                }
            }
            onClickRef.current?.();
        }
        document.addEventListener('mousedown', mousedown);
        return () => document.removeEventListener('mousedown', mousedown);
    }, [clsname, enabled]);
}
