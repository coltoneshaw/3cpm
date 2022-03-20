import React from 'react';
import Tooltip from '@mui/material/Tooltip';

interface Props {
  // In your case
  Icon: React.ComponentType,
  name: string,
  onClick: any
}

const SidebarLink = ({ Icon, name, onClick }: Props) => (
  <div
    className="sidebarOption"
    onClick={onClick}
    role="button"
    onKeyPress={onClick}
    tabIndex={0}
  >
    <Tooltip title={name} placement="right" arrow>
      <span>
        <Icon />
      </span>
    </Tooltip>
  </div>
);

export default SidebarLink;
