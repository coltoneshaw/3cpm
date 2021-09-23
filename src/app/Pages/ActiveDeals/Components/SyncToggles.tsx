import React, { useEffect, useState } from "react";

import { FormControlLabel, Checkbox } from '@material-ui/core';

import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { setSyncData } from "@/app/redux/threeCommas/threeCommasSlice";

import { Type_SyncOptions } from "@/types/3Commas";

/**
 * 
 * @returns Checkboxes for configuring the state of auto sync.
 */
const SyncToggles = () => {

    const { syncOptions, autoRefresh } = useAppSelector(state => state.threeCommas);
    const dispatch = useAppDispatch()

    const [summary, setSummary] = useState(() => syncOptions.summary)
    const [notifications, setNotifications] = useState(() => syncOptions.notifications)

    const changeSummary = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSyncData({ summary: event.target.checked }))
    }


    const changeNotifications = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSyncData({ notifications: event.target.checked }))
    }

    useEffect(() => {
        setSummary(syncOptions.summary)
        setNotifications(syncOptions.notifications)
    }, [syncOptions])


    return (
        <div className="syncToggles">
            <FormControlLabel
                control={
                    <Checkbox
                        checked={notifications}
                        onChange={changeNotifications}
                        name="notifications"
                        color="primary"
                        style={{ color: 'var(--color-secondary)' }}

                    />
                }
                label="Enable Notifications"

            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={summary}
                        onChange={changeSummary}
                        name="summary"
                        style={{ color: 'var(--color-secondary)' }}

                    />
                }
                label="Summarize Notifications"
            />


        </div>
    )
}

export default SyncToggles;