import React from "react";

import { Button } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';

import { useGlobalData } from '@/app/Context/DataContext';
import { ToastNotifcations } from '@/app/Features/Index'

interface Type_ButtonProps {
    style?: object,
    className?: string
    disabled?: boolean
}
const UpdateDataButton = ({ style, className}: Type_ButtonProps) => {

    const state = useGlobalData()
    const { data: { isSyncing }, actions: { updateAllData } } = state

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
                disabled={isSyncing}
                className={className}
                onClick={() => {
                    updateAllData(1000, handleClick)
                }}
                disableElevation
                endIcon={<SyncIcon className={isSyncing ? "iconSpinning" : ""} />}
                style={style}
            >
                Update Data
            </Button>
            <ToastNotifcations open={open} handleClose={handleClose} message="Sync finished." />
        </>
    )
}

export default UpdateDataButton;