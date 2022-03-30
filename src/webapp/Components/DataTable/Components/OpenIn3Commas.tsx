import React from 'react';

import LaunchIcon from '@mui/icons-material/Launch';

import { openLink } from '@/utils/helperFunctions';

type TypeOpenIn3Commas = {
  cell: any,
  bot_id: string | undefined | number,
  className?: string
};

const defaultsProps = {
  className: undefined,
};

const OpenIn3Commas: React.FC<TypeOpenIn3Commas> = ({ cell, bot_id, className }) => {
  const url = (bot_id) ? `https://3commas.io/bots/${bot_id}/edit` : 'https://3commas.io/bots';

  return (
    <span
      data-text={cell.row.original.bot_settings}
      className={className}
      style={{
        paddingLeft: '3px',
        width: '100%',
        textAlign: 'left',
      }}
    >
      {cell.value}
      <LaunchIcon
        style={{
          height: '.4em',
          cursor: 'pointer',
          alignSelf: 'center',
          opacity: 0.6,
        }}
        onClick={() => openLink(url)}
      />
    </span>
  );
};

OpenIn3Commas.defaultProps = defaultsProps;

export default OpenIn3Commas;
