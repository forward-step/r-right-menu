import { useCallback, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { RightMenuItem, RightMenuConfig } from '../interface';
import { Menu } from '../components/menu';
import { useRefValue } from './useRefValue';
import { useMouseWheel } from './useMouseWheel';

export function useRightMenu(
    items: RightMenuItem[] | (() => RightMenuItem[]),
    cfg: RightMenuConfig = {}
) {
    // container
    const containerRef = useRef(document.createElement('div'));
    useEffect(() => {
        document.body.appendChild(containerRef.current);
        return () => containerRef.current.remove();
    }, []);

    // create right-menu
    const rootRef = useRef<Root | null>(null);
    const close = () => {
        rootRef.current?.render(null);
    };
    const openRef = useRefValue((x: number, y: number) => {
        rootRef.current ??= createRoot(containerRef.current);
        const menuItems = typeof items === 'function' ? items() : items;

        rootRef.current.render(
            <Menu
                className={cfg.className}
                style={cfg.style}
                items={menuItems}
                left={x}
                top={y}
                zIndex={cfg.zIndex ?? 100}
                level={0}
                back={close}
                destory={close}
                renderMenuItem={cfg.renderMenuItem}
            />
        );
    });

    // close when mousewheel
    useMouseWheel(close);

    const disabledRef = useRefValue(cfg.disabled);
    const contextmenu = useCallback((ev: MouseEvent) => {
        ev.preventDefault();
        const disabledFn = disabledRef.current;
        const exec = () => openRef.current(ev.clientX, ev.clientY);
        const isDisabled =
            typeof disabledFn === 'function'
                ? disabledFn(ev)
                : typeof disabledFn === 'boolean'
                ? disabledFn
                : false;
        if (typeof isDisabled === 'boolean') {
            !isDisabled && exec();
        } else {
            isDisabled.then(exec);
        }
    }, []);

    return useCallback((node: HTMLElement | null) => {
        node?.removeEventListener('contextmenu', contextmenu);
        node?.addEventListener('contextmenu', contextmenu);
    }, []);
}
