import React from 'react';

import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

import { useAppSelector } from '@/app/redux/hooks';
import {refreshFunction} from '@/app/redux/threeCommas/Actions'


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
    const { autoRefresh} = useAppSelector(state => state.threeCommas);

    return (
        <Button
            // variant="contained"
            // color="primary"
            className={className}
            onClick={async () => {
                // activate the interval timer here.
                if(autoRefresh) {
                    refreshFunction('stop')
                    return
                }

                refreshFunction('start', 200)
            }}
            disableElevation
            startIcon={ (autoRefresh) ? <StopIcon /> : <PlayArrowIcon/> }
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


