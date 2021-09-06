import React, { useState } from 'react';

import { Button } from '@material-ui/core';

import { useGlobalState } from '@/app/Context/Config';
import { useGlobalData } from '@/app/Context/DataContext';
import LoaderIcon from '@/app/Components/icons/Loading/Loading'

interface SubmitButtons {
    setOpen: any
}
const SaveSubmitButtons = ({setOpen}: SubmitButtons) => {
    const configState = useGlobalState()
    const { reset, setConfigBulk }  = configState

    const dataState = useGlobalData()
    const {actions: { updateAllData  }, data: { isSyncing}} = dataState
    const [ , setLoaderIcon ] = useState(false)

    const callback = () => setOpen(true)


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
                // variant="contained"
                // color="primary"
                className="CtaButton"
                onClick={ async () => {
                    setLoaderIcon(true)
                    try{
                        const config = await setConfigBulk() 
                        if(config){
                            await updateAllData(1000, callback)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    setLoaderIcon(false)
                }}
                disableElevation
            >
                {( isSyncing) ? <> Syncing... <LoaderIcon /> </> : "Save"}
            </Button>
        </div>
    )
}

export default SaveSubmitButtons;