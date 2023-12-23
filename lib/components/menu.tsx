import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { bem } from 'bem2';
import { MenuItemInnerProps, MenuItemStatus, MenuProps, RightMenuItem } from '../interface';
import { MenuItem } from './menu-item';
import { useClickAway } from '../hooks/useClickAway';
import { useKey } from '../hooks/useKey';
import './menu.scss';

const { emsc } = bem('right-menu');
function callWithStatus<R>(func: R | ((status: MenuItemStatus) => R), status: MenuItemStatus): R {
    return func instanceof Function ? func(status) : func;
}
function call<T>(func: T | (() => T)): T {
    return func instanceof Function ? func() : func;
}
function isMenuItem(item: RightMenuItem): item is MenuItemInnerProps {
    return !!item && 'label' in item;
}
function isValid(item: RightMenuItem): item is MenuItemInnerProps {
    return !!item && isMenuItem(item) && !call(item.hide) && !call(item.disabled);
}

export function Menu({
    items,
    left,
    top,
    level,
    zIndex,
    prevMenuWidth = 0,
    renderMenuItem: RenderMenuItem = MenuItem,
    defaultSelectedIndex = -1,
    back,
    destory,
    ...props
}: MenuProps) {
    const domRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(defaultSelectedIndex);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [isArrowOpen, setIsArrowOpen] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const children = useMemo(() => {
        const item = items[selectedIndex];
        if (isValid(item)) return item.children ?? [];
        return [];
    }, [items, selectedIndex]);

    const isOpenSecondMenu = children.length > 0 && !!rect;
    function handleClick(item: RightMenuItem) {
        if (isValid(item)) {
            if (Array.isArray(item.children) && item.children.length > 0) {
                openSecondMenu(item);
            } else {
                destory();
                // if (import.meta.env.DEV) console.log('click: ', item);
                item.click?.();
            }
        }
    }
    function openSecondMenu(item: RightMenuItem) {
        if (
            isValid(item) &&
            domRef.current &&
            Array.isArray(item.children) &&
            item.children.length > 0
        ) {
            const target = domRef.current.querySelector(
                `.${emsc('item')}:nth-of-type(${selectedIndex + 1})`
            );
            if (target) {
                setRect(target.getBoundingClientRect());
                setIsArrowOpen(true);
            }
        }
    }

    // show position
    useLayoutEffect(() => {
        const el = domRef.current;
        if (!el) return;

        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight;
        const { width, height } = el.getBoundingClientRect();

        if (level === 0) {
            if (screenWidth - left >= width) {
                setX(left);
            } else if (screenWidth >= width) {
                setX(screenWidth - width);
            } else {
                setX(0);
            }

            if (screenHeight - top >= height) {
                setY(top);
            } else if (top >= height) {
                setY(top - height);
            } else if (screenHeight >= height) {
                setY(screenHeight - height);
            } else {
                setY(0);
            }
        } else {
            const style = getComputedStyle(el);
            const borderTop = parseFloat(style.borderTop);
            const paddingTop = parseFloat(style.paddingTop);

            if (screenWidth - left >= width) {
                setX(left);
            } else if (left - prevMenuWidth >= width) {
                setX(left - prevMenuWidth - width);
            } else {
                setX(left);
            }

            const offsetTop = top - borderTop - paddingTop;
            if (screenHeight - offsetTop >= height) {
                setY(offsetTop);
            } else if (screenHeight >= height) {
                setY(screenHeight - height);
            } else {
                setY(offsetTop);
            }
        }
    }, []);

    // ⬆⬇⬅➡
    useEffect(() => {
        function step(step: number, defaultValue: number) {
            setSelectedIndex(i => {
                const length = items.length;
                const next = (i: number) => (i + step + length) % length;
                let index: number;
                if (i < 0 || i >= length) index = defaultValue;
                else index = next(i);

                let _for_num = 0;
                while (true) {
                    // Prevent dead circulation
                    if (++_for_num > length) {
                        index = -1;
                        break;
                    }
                    const item = items[index];
                    if (!isValid(item)) {
                        index = next(index);
                        continue;
                    }
                    break;
                }

                return index;
            });
        }
        function down(ev: KeyboardEvent) {
            // default is scroll page
            if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(ev.key)) {
                ev.preventDefault();
            }

            // only operator top level
            if (isOpenSecondMenu) return;

            // move
            if (ev.key === 'ArrowDown') {
                step(1, 0);
            } else if (ev.key === 'ArrowUp') {
                step(-1, items.length - 1);
            }

            // back
            else if (ev.key === 'ArrowLeft' && level !== 0) {
                back();
            }
            // menu children
            else if (ev.key === 'ArrowRight') {
                openSecondMenu(items[selectedIndex]);
            }
        }
        window.addEventListener('keydown', down);
        return () => window.removeEventListener('keydown', down);
    }, [items, isOpenSecondMenu, selectedIndex]);

    // outside click
    useClickAway(`.${emsc()}`, destory, level === 0);

    // ESC
    useKey('Escape', () => {
        if (isOpenSecondMenu) return;
        back();
    });

    // enter
    useKey('Enter', () => {
        if (isOpenSecondMenu) return;
        handleClick(items[selectedIndex]);
    });

    return (
        <div
            ref={domRef}
            className={emsc(null, null, null, [`level-${level}`, props.className])}
            style={{
                ...props.style,
                left: x,
                top: y,
                zIndex,
            }}
            onMouseLeave={() => {
                if (isOpenSecondMenu) return;
                setRect(null);
                setIsArrowOpen(false);
                setSelectedIndex(-1);
            }}
            onContextMenu={e => e.preventDefault()}
        >
            {items.map((it, index) => {
                if (call(it.hide)) return <div key={index} className={emsc('none')}></div>;
                if (!isMenuItem(it)) {
                    if (it.type === 'divider')
                        return <div key={index} className={emsc('divider')}></div>;
                    return <div key={index} className={emsc('none')}></div>;
                }
                const id = it.key ?? index.toString();
                const isDisabled = call(it.disabled);
                const isSelected = !isDisabled && selectedIndex === index;
                const hasChildren = Array.isArray(it.children) && it.children.length > 0;
                return (
                    <div
                        key={id}
                        className={emsc('item')}
                        onMouseEnter={ev => {
                            setSelectedIndex(index);
                            setRect(ev.currentTarget.getBoundingClientRect());
                            setIsArrowOpen(false);
                        }}
                        onMouseLeave={() => setSelectedIndex(index)}
                        onClick={() => handleClick(it)}
                    >
                        <RenderMenuItem
                            {...it}
                            label={callWithStatus(it.label, { hasChildren, isSelected })}
                            disabled={isDisabled}
                            icon={callWithStatus(it.icon, { hasChildren, isSelected })}
                            isSelected={isSelected}
                            hasChildren={hasChildren}
                        />
                    </div>
                );
            })}
            {createPortal(
                isOpenSecondMenu ? (
                    <Menu
                        {...props}
                        key={selectedIndex}
                        left={rect.left + rect.width}
                        top={rect.top}
                        prevMenuWidth={rect.width}
                        zIndex={zIndex + 1}
                        items={children}
                        level={level + 1}
                        defaultSelectedIndex={isArrowOpen ? 0 : undefined}
                        back={() => {
                            setRect(null);
                            setIsArrowOpen(false);
                        }}
                        destory={destory}
                        renderMenuItem={RenderMenuItem}
                    />
                ) : null,
                document.body
            )}
        </div>
    );
}
