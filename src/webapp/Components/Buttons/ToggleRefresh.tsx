import React, { useEffect, useState } from 'react';

import { Button, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

import './ToggleRefresh.scss';
import { useAppDispatch, useAppSelector } from 'webapp/redux/hooks';
import { setAutoRefresh } from 'webapp/redux/threeCommas/threeCommasSlice';
import { refreshFunction } from 'webapp/redux/threeCommas/Actions';

interface TypeButtonProps {
  style?: object,
  className?: string
}

const defaultProps: TypeButtonProps = {
  style: {},
  className: '',
};

/**
 *
 * TODO
 * - Move the state of this timer somewhere shared so it doesn't continue to cause issues with updating
 */
const ToggleRefreshButton: React.FC<typeof defaultProps> = ({ style, className }) => {
  const {
    autoRefresh, isSyncingTime, isSyncing, syncOptions,
  } = useAppSelector((state) => state.threeCommas);
  const dispatch = useAppDispatch();

  const refreshRate = 500;
  const max = 15000;

  const [timeout, setActualTimeout] = useState<NodeJS.Timeout | null>(null);
  const [counter, setCounter] = useState<number>(() => {
    if (autoRefresh) {
      if (isSyncingTime > 0) return isSyncingTime + max - Date.now();
      if (syncOptions.time
        && syncOptions.time > 0
      ) return syncOptions.time + max - Date.now();
    }
    return 0;
  });

  useEffect(() => {
    if (autoRefresh && counter <= 0) setCounter(max);
  }, [autoRefresh]);

  useEffect(() => {
    if (!autoRefresh) return;

    if (isSyncing === true) setCounter(0);
    if (isSyncing === false && counter <= 0) setCounter(max);
  }, [isSyncing]);

  useEffect(() => {
    if (!autoRefresh || isSyncing) return;

    // TODO - resolve the TS error for timeout
    if (counter > 0) {
      // @ts-ignore
      setActualTimeout(setTimeout(() => {
        setCounter((prevState) => Math.max(prevState - refreshRate, 0));
      }, refreshRate));
    }
  }, [counter, isSyncing]);

  // clear timeout when unmounting
  useEffect(() => () => {
    if (timeout) clearTimeout(timeout);
  }, []);

  const onClick = () => {
    if (autoRefresh) {
      dispatch(setAutoRefresh(false));
      return;
    }
    dispatch(setAutoRefresh(true));
    refreshFunction('run', 200);
  };

  return (
    <Button
      // variant="contained"
      // color="primary"
      className={className}
      onClick={onClick}
      disableElevation
      startIcon={(autoRefresh) ? <StopIcon /> : <PlayArrowIcon />}
      style={{
        ...style,
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-lightbackground)',
      }}
    >
      {' '}
      Auto Refresh
      {
        autoRefresh
        && (
          <LinearProgress
            variant="determinate"
            value={100 - ((counter * 100) / max)}
          />
        )
      }
    </Button>
  );
};

export default ToggleRefreshButton;
