import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { updateConfig, checkProfileIsValid, deleteProfileByIdGlobal, saveEditingToConfigFile } from '@/app/redux/configActions'
import { storeEditingProfileData } from '@/app/redux/configSlice'
import {syncNewProfileData} from '@/app/redux/threeCommas/Actions'


import { Button } from '@mui/material';


import LoaderIcon from '@/app/Components/icons/Loading/Loading'

interface SubmitButtons {
    setOpen: any
}
const SaveDeleteButtons = ({ setOpen }: SubmitButtons) => {
    const dispatch = useAppDispatch()
    const { editingProfile, config } = useAppSelector(state => state.config);

    const { isSyncing } = useAppSelector(state => state.threeCommas);
    const [, setLoaderIcon] = useState(false)

    const callback = () => setOpen(true)

    const setProfileConfig = async () => {
        const { status, message } = checkProfileIsValid(editingProfile)

        if (status) {
            setLoaderIcon(true)
            try {
                dispatch(storeEditingProfileData())

                // saving the config here so the update function below can work properly.
                const saveEditing = await saveEditingToConfigFile()
                if(!saveEditing) throw  Error('Error saving profile to the config.')
                
                //updating the editing profile's data
                const update = await syncNewProfileData(1000, editingProfile);

                // Saving and confirming that this saved
                // const cfg = await storeConfigInFile()
                if (update) {
                    updateConfig();
                    callback()
                }
            } catch (error) {

                // if there is an error storing the editing profile, the data from the database gets deleted.
                //@ts-ignore
                await electron.database.deleteAllData(editingProfile.id)
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
                    deleteProfileByIdGlobal(config, editingProfile.id, setOpen(true))
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