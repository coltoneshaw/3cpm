import React, { useState, useEffect } from 'react';

import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

import { useGlobalData } from '@/app/Context/DataContext';


interface Type_ButtonProps {
    style?: object,
    className?: string
}

/**
 * 
 * TODO
 * - Move the state of this timer somewhere shared so it doesn't continue to cause issues with updating
 */
const ToggleRefreshButton = ({ style, className }: Type_ButtonProps) => {
    const state = useGlobalData()
    const { data: { isSyncing }, actions: { updateAllData }, autoSync: { buttonEnabled, setButtonEnabled } } = state

    return (
        <Button
            // variant="contained"
            // color="primary"
            className={className}
            onClick={async () => {
                // activate the interval timer here.
                setButtonEnabled( ( prevState:boolean ) => {
                    // console.log(`timer was ${prevState} and now it's ${!prevState}`)
                    return !prevState
                })
            }}
            disableElevation
            startIcon={ (buttonEnabled) ? <StopIcon /> : <PlayArrowIcon/> }
            style={{
                ...style, 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-lightbackground)'
            }}
        > Auto Refresh
        </Button>
    )
}

export default ToggleRefreshButton;


