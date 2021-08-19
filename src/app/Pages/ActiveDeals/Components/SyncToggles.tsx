import React, { useEffect } from "react";

import { FormControlLabel, Checkbox} from '@material-ui/core';

import { useGlobalData } from "@/app/Context/DataContext";

import { Type_SyncOptions } from "@/types/3Commas";

/**
 * 
 * @returns Checkboxes for configuring the state of auto sync.
 */
const SyncToggles = () => {

    const dataState = useGlobalData()
    const { autoSync: { syncOptions, setSyncOptions } } = dataState

    const changeSummary = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSyncOptions( ( prevState:Type_SyncOptions ) => ({
            ...prevState,
            summary: event.target.checked
        }))
    }

    const changeNotifications = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSyncOptions( ( prevState:Type_SyncOptions ) => ({
            ...prevState,
            notifications: event.target.checked
        }))
    }

    // can't have notifications disabled and summary enabled
    useEffect(() => {
        if(!syncOptions.notifications) {
            setSyncOptions( ( prevState:Type_SyncOptions ) => ({
                ...prevState,
                summary: false
            }))
        }
    }, [syncOptions.notifications])

    return (
        <div style={{alignSelf: 'flex-start'}}>
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