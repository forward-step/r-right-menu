import { useEffect, useRef } from 'react';

export function useMouseWheel(onwheel: () => void) {
    const onwheelRef = useRef(onwheel);
    useEffect(() => {
        function handle() {
            onwheelRef.current?.();
        }
        let eventname =
            'onwheel' in document
                ? 'wheel' // High version browser
                : 'onmousewheel' in document
                ? 'mousewheel' // webkit and ie
                : 'DOMMouseScroll'; // Firefox
        document.addEventListener(eventname, handle);
        return () => document.removeEventListener(eventname, handle);
    }, []);
}
