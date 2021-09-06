import React from "react";
import { ToastNotifcations } from '@/app/Features/Index'
import { Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

interface Type_SaveButton {
    saveFunction: any
    className: string
}

const SaveButton = ({saveFunction, className} : Type_SaveButton ) => {

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
            endIcon={<SaveIcon />}
            onClick={() => {
                saveFunction()
                setOpen(true)
            }}

            className={className}

        >
            Save table data
        </Button>
        <ToastNotifcations open={open} handleClose={handleClose} message="Sync finished." />

        </>
    )
}

export default SaveButton;