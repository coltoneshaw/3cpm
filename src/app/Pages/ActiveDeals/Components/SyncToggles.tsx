import React, { useEffect } from "react";

import { FormControlLabel, Checkbox} from '@material-ui/core';

import { useAppSelector } from '@/app/redux/hooks';
import { setSyncData } from "@/app/redux/threeCommas/threeCommasSlice";

import { Type_SyncOptions } from "@/types/3Commas";

/**
 * 
 * @returns Checkboxes for configuring the state of auto sync.
 */
const SyncToggles = () => {

    const { syncOptions, autoRefresh} = useAppSelector(state => state.threeCommas);

    // const { autoSync: { syncOptions, setSyncOptions } } = dataState

    const changeSummary = (event: React.ChangeEvent<HTMLInputElement>) =>  setSyncData({summary: event.target.checked})

    const changeNotifications = (event: React.ChangeEvent<HTMLInputElement>) =>  setSyncData({notifications: event.target.checked})


    return (
        <div className="syncToggles">
        <FormControlLabel
            control={
                <Checkbox
                    checked={syncOptions.summary}
                    onChange={changeSummary}
                    name="summary"
                    style={{color: 'var(--color-secondary)'}}

                />
            }
            label="Summary Notifications"
        />

        <FormControlLabel
            control={
                <Checkbox
                    checked={syncOptions.notifications}
                    onChange={changeNotifications}
                    name="notifications"
                    color="primary"
                    style={{color: 'var(--color-secondary)'}}

                />
            }
            label="Enable Notifications"

        />
        </div>
    )
}

export default SyncToggles;