import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { updateConfig, checkProfileIsValid, deleteProfileByIdGlobal, storeConfigInFile } from '@/app/redux/configActions'
import {syncNewProfileData} from '@/app/redux/threeCommas/Actions'


import { Button } from '@mui/material';


import LoaderIcon from '@/app/Components/icons/Loading/Loading'

interface SubmitButtons {
    setOpen: any
}
const SaveDeleteButtons = ({ setOpen }: SubmitButtons) => {
    const dispatch = useAppDispatch()
    const { currentProfile, config } = useAppSelector(state => state.config);

    const { isSyncing } = useAppSelector(state => state.threeCommas);
    const [, setLoaderIcon] = useState(false)

    const callback = () => setOpen(true)

    const setProfileConfig = async () => {
        const { status, message } = checkProfileIsValid(currentProfile)

        if (status) {
            setLoaderIcon(true)
            try {

                // saving the config here so the update function below can work properly.
                await storeConfigInFile()
                
                //updating the current profile's data
                const update = await syncNewProfileData(1000, currentProfile);
                if (update) {

                    //@ts-ignore
                    await electron.config.set('current', currentProfile.id)

                    updateConfig();
                    callback()
                }
            } catch (error) {

                // if there is an error storing the current profile, the data from the database gets deleted.
                //@ts-ignore
                await electron.database.deleteAllData(currentProfile.id)
                console.error(error)
                alert('There was an error storing your profile data. Please try again. If the issue persists look at the documentation for additional guidance.')
            } finally {
                setLoaderIcon(false)
            }
        } else {
            alert(message)
        }


    }


    return (
        <div className="flex-row padding settingsButtonDiv" >
            <Button
                variant="contained"
                className="deleteProfile"
                onClick={() => {
                    deleteProfileByIdGlobal(config, currentProfile.id, setOpen(true))
                }}
                disableElevation
            >
                Delete Profile
            </Button>
            <Button
                // variant="contained"
                // color="primary"
                className="CtaButton"
                onClick={() => {
                    setProfileConfig()
                }}
                disableElevation
            >
                {(isSyncing) ? <> Syncing... <LoaderIcon /> </> : "Save Profile"}
            </Button>
        </div>
    )
}

export default SaveDeleteButtons;