import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import {refreshFunction} from '@/app/redux/threeCommas/Actions'
import {setAutoRefresh} from '@/app/redux/threeCommas/threeCommasSlice'


const useRefreshState = () => {
    const { autoRefresh, syncOptions } = useAppSelector(state => state.threeCommas);
    const [counter, setCounter] = useState<number>(0);
    const dispatch = useAppDispatch();


    const [localRefresh, updateLocalRefresh] = useState(() => autoRefresh)

    useEffect(() => {
        updateLocalRefresh(autoRefresh);
        if (autoRefresh) setCounter(15);
        if (!autoRefresh) setCounter(0);
    }, [autoRefresh]);

    useEffect(() => {
        if (syncOptions.time && syncOptions.time > 0) setCounter(15);
        console.log(syncOptions.time)
    }, [syncOptions.time])

    useEffect(() => {
        if (counter > 0 && localRefresh) setTimeout(() => setCounter(prevState => prevState - 1), 1000);
        console.log(counter)
        console.log(localRefresh)
    }, [counter]);

    const onClick = () => {
        // activate the interval timer here.
        if (localRefresh) {
            dispatch(setAutoRefresh(false))
            return
        }
        dispatch(setAutoRefresh(true));
        refreshFunction('run', 200)
    }

    return {
        onClick,
        localRefresh,
        counter
    }
}

export default useRefreshState;