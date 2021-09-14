import React, { useState } from 'react';

import { Button } from '@material-ui/core';

import { useGlobalState } from '@/app/Context/Config';
import { useGlobalData } from '@/app/Context/DataContext';

import {storeConfigInFile} from '@/app/redux/configActions'
import LoaderIcon from '@/app/Components/icons/Loading/Loading'

interface SubmitButtons {
    setOpen: any
}
const SaveDeleteButtons = ({setOpen}: SubmitButtons) => {
    const configState = useGlobalState()
    const { config, reset, setConfigBulk }  = configState

    const dataState = useGlobalData()
    const {actions: { updateAllData  }, data: { isSyncing}} = dataState
    const [ , setLoaderIcon ] = useState(false)

    const callback = () => setOpen(true)


    return (
        <div className="flex-row padding settingsButtonDiv" >
            <Button
                variant="contained"
                className="deleteProfile"
                onClick={() => {
                    const accept = confirm("Deleting this profile will delete all information attached to it including API keys, and the database. This action will not impact your 3Commas account in any way. Confirm you would like to locally delete this profile.");
                    if(accept){
                        // @ts-ignore
                        console.log('deleted the profile!')

                        // delete the profile command
                        // route the user back to a their default profile OR route the user to a new blank profile..?
                        // What happens if it's the last profile? Show a warning maybe saying:
                        // "This is your only profile. Unable to delete. If you want to reset your 3C Portfolio Manager use Menu > Help > Reset all data."
                        setOpen(true)
                    }
                }}
                disableElevation
            >
                Delete Profile
            </Button>
            <Button
                // variant="contained"
                // color="primary"
                className="CtaButton"
                onClick={ async () => {
                    setLoaderIcon(true)
                    try{
                        const cfg = await storeConfigInFile()
                        // if(cfg){
                        //     await updateAllData(1000, callback)
                        // }
                    } catch (error) {
                        console.error(error)
                    }
                    setLoaderIcon(false)
                }}
                disableElevation
            >
                {( isSyncing) ? <> Syncing... <LoaderIcon /> </> : "Save Profile"}
            </Button>
        </div>
    )
}

export default SaveDeleteButtons;