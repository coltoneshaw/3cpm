import React from 'react';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { ToastNotifications } from 'webapp/Features/Index';

interface TypeSaveButton {
  saveFunction: any
  className: string
}

const SaveButton = ({ saveFunction, className }: TypeSaveButton) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Button
        startIcon={<SaveIcon />}
        onClick={() => {
          saveFunction();
          setOpen(true);
        }}
        className={className}
      >
        Save table data
      </Button>
      <ToastNotifications
        open={open}
        handleClose={handleClose}
        message="Sync finished."
      />

    </>
  );
};

export default SaveButton;
