import React, { ReactInstance, SetStateAction } from 'react';
import {Button, Snackbar, IconButton} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

interface Type_Snack {
    open: boolean
    handleClose: any
    message: string
}

const SimpleSnackbar = ({open, handleClose, message}: Type_Snack) => {
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
}

export default SimpleSnackbar;
