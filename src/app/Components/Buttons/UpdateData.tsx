import React, { useEffect, useState } from 'react';

import { Button } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

import { useAppSelector } from '@/app/redux/hooks';
import { updateAllData } from '@/app/redux/threeCommas/Actions';

import { ToastNotifications } from '@/app/Features/Index';

interface TypeButtonProps {
  style?: {},
  className?: string
  disabled?: boolean
}

const defaultProps: TypeButtonProps = {
  style: {},
  className: '',
  disabled: undefined,
};

const UpdateDataButton: React.FC<typeof defaultProps> = ({ style, className }) => {
  const {
    threeCommas: { isSyncing },
    config: { currentProfile },
  } = useAppSelector((state) => state);

  const [spinning, updateSpinning] = useState(false);
  useEffect(() => updateSpinning(isSyncing), [isSyncing]);

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Button
        // variant="contained"
        // color="primary"
        disabled={spinning}
        className={className}
        onClick={() => updateAllData(
          currentProfile,
          'fullSync',
          1000,
          handleClick,
        )}
        disableElevation
        // startIcon={}
        style={style}
      >
        <SyncIcon className={spinning ? 'iconSpinning' : ''} />
        {' '}

      </Button>
      <ToastNotifications
        open={open}
        handleClose={handleClose}
        message="Sync finished."
      />
    </>
  );
};

export default UpdateDataButton;
