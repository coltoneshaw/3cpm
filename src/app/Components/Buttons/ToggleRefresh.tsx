import React, {useEffect, useState} from 'react';

import { Button, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import type useRefreshState from '@/app/Components/Buttons/RefreshState';



interface Type_ButtonProps {
    style?: object,
    className?: string
    refreshState: ReturnType<typeof useRefreshState>
}

import './ToggleRefresh.scss'


/**
 * 
 * TODO
 * - Move the state of this timer somewhere shared so it doesn't continue to cause issues with updating
 */
const ToggleRefreshButton = ({ style, className, refreshState }: Type_ButtonProps) => {

    const {counter, localRefresh, onClick} = refreshState

    

    return (
        <Button
            // variant="contained"
            // color="primary"
            className={className}
            onClick={onClick}
            disableElevation
            startIcon={ (localRefresh) ? <StopIcon /> : <PlayArrowIcon/> }
            style={{
                ...style, 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-lightbackground)'
            }}
        > Auto Refresh {(counter && counter > 0) ? `(${counter}s)` : ''}
            {/* {autoRefresh.active && (<LinearProgress variant="determinate" value={counter} />)} */}
        </Button>
    )
}

export default ToggleRefreshButton;


