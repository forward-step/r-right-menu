# React Right Menu

[**Live Demo**](https://www.chromatic.com/component?appId=658699e76813e4bd0cb9fd2a&csfId=hooks-right-menu&buildNumber=3&k=65869cf33e3af2dff17afe6c-1200px-interactive-true&h=14&b=-5)

# Demo

```js
import { useRightMenu } from 'r-right-menu';
import 'r-right-menu/style.css';

function App() {
    const ref = useRightMenu([
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
    ], {
        // 菜单的额外样式
        className: '',
        style: {},
        zIndex: 100,
        // 判断是否禁用
        disabled: async (ev) => false,
        // 自定义渲染
        renderMenuItem: ({
            label, icon, disabled, hasChildren, isSelected
        }) => {
            return <><>;
        },
    });
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
```
