import { PictureOutlined, QrcodeOutlined, ReloadOutlined, RightOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useRightMenu, RightMenuItem, RightMenuConfig } from '../lib';

const menus: RightMenuItem[] = [
    { label: '返回' },
    {
        label: '前进',
        disabled: true,
    },
    {
        label: '重新加载',
        icon: <ReloadOutlined />,
        click() {
            window.location.reload();
        },
    },
    { type: 'divider' },
    { type: 'divider', hide: true }, // check divider's hide
    { label: '另存为...' },
    { label: '打印...' },
    { label: '投放...' },
    { label: '使用Google搜索图片', icon: <PictureOutlined /> },
    { type: 'divider' },
    { label: '发送到你的设备' },
    { label: '为此页创建二维码', icon: <QrcodeOutlined /> },
    { type: 'divider' },
    {
        key: 'translate',
        label: '使用网页翻译',
        children: [
            {
                key: '简体',
                label: '翻译为简体中文',
            },
            {
                key: '繁体',
                label: '翻译为繁体中文',
            },
        ],
    },
    { type: 'divider' },
    {
        label: '多级菜单测试',
        children: [
            { label: '菜单-1' },
            {
                label: '菜单-2',
                children: [{ label: '菜单-1' }, { label: '菜单-2' }, { label: '菜单-3' }],
            },
            { label: '菜单-3' },
        ],
    },
];

function Component({ config }: { config: RightMenuConfig }) {
    const ref = useRightMenu(menus, config);
    return (
        <div
            ref={ref}
            style={{
                width: '100%',
                height: 'calc(100vh + 10px)',
                overflow: 'hidden',
                background: 'rgb(245, 245, 245)',
                color: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            Right Click on here
        </div>
    );
}

const meta = {
    title: 'hooks/right-menu',
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const basic: Story = {
    render: () => {
        return (
            <Component
                config={{
                    className: 'custom-clsname',
                    style: {
                        opacity: 1,
                    },
                    disabled: false,
                    zIndex: 1000,
                }}
            />
        );
    },
};

export const renderItem: Story = {
    render: () => {
        return (
            <Component
                config={{
                    renderMenuItem: ({ label, icon, disabled, hasChildren, isSelected }) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '5px 16px',
                                    fontSize: 14,
                                    color: disabled ? 'gray' : isSelected ? '#409eff' : 'black',
                                    cursor: disabled
                                        ? 'not-allowed'
                                        : isSelected
                                        ? 'pointer'
                                        : 'none',
                                }}
                            >
                                <div style={{ width: 16 }}>{icon}</div>
                                <div>{label}</div>
                                {hasChildren ? <RightOutlined /> : null}
                            </div>
                        );
                    },
                }}
            />
        );
    },
};
