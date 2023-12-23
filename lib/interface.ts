import { CSSProperties, FC, ReactNode } from 'react';

export interface RightMenuConfig {
    className?: string;
    style?: CSSProperties;
    /**
     * disabled right menu
     * @default false
     */
    disabled?: boolean | ((ev: MouseEvent) => boolean | Promise<void>);
    /**
     * fixed z-index
     * @default 100
     */
    zIndex?: number;
    /**
     * render menu item
     */
    renderMenuItem?: FC<MenuItemProps>;
}

export type MenuItemStatus = {
    hasChildren: boolean;
    isSelected: boolean;
};

export type MenuItemInnerProps = {
    key?: string;
    icon?: ReactNode | ((status: MenuItemStatus) => ReactNode);
    label: ReactNode | ((status: MenuItemStatus) => ReactNode);
    disabled?: boolean | (() => boolean);
    hide?: boolean | (() => boolean);
    children?: RightMenuItem[];
    click?: () => void;
};

export type RightMenuItem =
    | {
          type: 'divider';
          hide?: boolean | (() => boolean);
      }
    | MenuItemInnerProps;

type MenuItemRemoveFunc = {
    [K in keyof MenuItemInnerProps]: K extends 'click'
        ? MenuItemInnerProps[K]
        : Exclude<MenuItemInnerProps[K], (...args: any[]) => any>;
};

export interface MenuProps {
    className?: string;
    style?: CSSProperties;
    items: RightMenuItem[];
    left: number;
    top: number;
    zIndex: number;
    prevMenuWidth?: number;
    level: number;
    back: () => void;
    destory: () => void;
    defaultSelectedIndex?: number;
    renderMenuItem?: FC<MenuItemProps>;
}

export interface MenuItemProps
    extends Omit<MenuItemRemoveFunc, 'hide' | 'children' | 'click'>,
        MenuItemStatus {}
