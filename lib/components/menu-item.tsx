import { RightOutlined } from '@ant-design/icons';
import { bem } from 'bem2';
import { MenuItemProps } from '../interface';
import './menu-item.scss';

const { emsc } = bem('menu-item');

export function MenuItem({ label, icon, disabled, isSelected, hasChildren }: MenuItemProps) {
    return (
        <div className={emsc(null, null, { disabled, selected: isSelected })}>
            <div className={emsc('icon')}>{icon}</div>
            <div>{label}</div>
            {hasChildren ? <RightOutlined className={emsc('arrow')} /> : null}
        </div>
    );
}
