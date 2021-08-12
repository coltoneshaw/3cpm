import React, { useState, useEffect } from 'react';

import { Button } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
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
                    console.log(`timer was ${prevState} and now it's ${!prevState}`)
                    return !prevState
                })
            }}
            disableElevation
            endIcon={<SyncIcon className={isSyncing ? "iconSpinning" : ""} />}
            style={{
                ...style, 
                backgroundColor: (buttonEnabled)? 'red': 'green' 
            }}
        >
            {// check the state here and show based on if the interval timer is activated or not.
                (buttonEnabled) ? 'Turn off auto-refresh' : 'Turn on auto-refresh'

            }
        </Button>
    )
}

export default ToggleRefreshButton;


