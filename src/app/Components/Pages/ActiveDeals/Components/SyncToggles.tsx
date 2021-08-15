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

    const changeSummary = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSummarySync(() => event.target.checked)
        console.log(event.target.checked)
    }

    const changeNotifications = (event:React.ChangeEvent<HTMLInputElement>) => {
        setNotifications(() => event.target.checked)
        console.log(event.target.checked)
    }


    return (
        <div style={{alignSelf: 'flex-start'}}>
        <FormControlLabel
            control={
                <Checkbox
                    checked={summarySync}
                    onChange={changeSummary}
                    name="summary"
                    color="primary"
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
                />
            }
            label="Enable Notifications"
        />
        </div>
    )
}

export default SyncToggles;