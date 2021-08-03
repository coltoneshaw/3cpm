import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

interface Props {
    // In your case
    Icon: React.ComponentType,
    name: string,
    onClick: any
}

const SidebarLink = ({ Icon, name, onClick }: Props) => {


    return (
        <div className="sidebarOption" onClick={onClick}>
            <Tooltip title={name} placement="right" arrow>
                <span>
                    <Icon />
                </span>
            </Tooltip>
        </div>
    )

}

export default SidebarLink;