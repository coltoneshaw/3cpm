import React from "react";

import { FormControlLabel, Checkbox} from '@material-ui/core';

import { useGlobalData } from "@/app/Context/DataContext";

/**
 * 
 * @returns Checkboxes for configuring the state of auto sync.
 */
const SyncToggles = () => {

    const dataState = useGlobalData()
    const { autoSync: { summarySync, setSummarySync, notifications, setNotifications } } = dataState

    const changeSummary = () => {
        setSummarySync((prevState: boolean) => !prevState)
    }

    const changeNotifications = () => {
        setNotifications((prevState: boolean) => !prevState)
    }


    return (
        <div style={{alignSelf: 'flex-start'}}>
        <FormControlLabel
            control={
                <Checkbox
                    checked={summarySync}
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
                    checked={notifications}
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