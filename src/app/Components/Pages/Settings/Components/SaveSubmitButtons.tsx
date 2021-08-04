import React from 'react';

import { Button } from '@material-ui/core';

import { useGlobalState } from '@/app/Context/Config';
import { useGlobalData } from '@/app/Context/DataContext';

interface SubmitButtons {
    setOpen: any
}
const SaveSubmitButtons = ({setOpen}: SubmitButtons) => {
    const configState = useGlobalState()
    const { reset, setConfigBulk }  = configState

    const dataState = useGlobalData()
    const {actions: {updateAllData}} = dataState



    return (
        <div className="flex-row padding settingsButtonDiv" >
            <Button
                variant="contained"
                onClick={() => {
                    const accept = confirm("Confirm that you want to delete all the data. This will require resyncing from 3Commas");
                    if(accept){
                    // @ts-ignore
                    electron.database.deleteAllData()
                    reset()
                    setOpen(true)
                    }

                }}
                disableElevation
            >
                Reset
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={ async () => {
                    await setConfigBulk() 
                    await updateAllData()
                    setOpen(true)
                }}
                disableElevation
            >
                Save
            </Button>
        </div>
    )
}

export default SaveSubmitButtons;