import React, { useEffect, useState } from "react";

import { Button } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

import { useAppSelector } from '@/app/redux/hooks';
import {updateAllData} from '@/app/redux/threeCommas/Actions'

import { ToastNotifcations } from '@/app/Features/Index'

interface Type_ButtonProps {
    style?: object,
    className?: string
    disabled?: boolean
}
const UpdateDataButton = ({ style, className}: Type_ButtonProps) => {
    const { threeCommas: {isSyncing}, config: {currentProfile}} = useAppSelector(state => state);

    const [spinning, updateSpinning] = useState(false)
    useEffect(() => updateSpinning(isSyncing), [isSyncing])


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
                onClick={() => updateAllData(1000, currentProfile, 'fullSync', handleClick)}
                disableElevation
                // startIcon={}
                style={style}
            >
                <SyncIcon className={spinning ? "iconSpinning" : ""} />            </Button>
            <ToastNotifcations open={open} handleClose={handleClose} message="Sync finished." />
        </>
    )
}

export default UpdateDataButton;