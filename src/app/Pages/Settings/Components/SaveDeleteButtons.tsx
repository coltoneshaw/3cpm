import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { storeConfigInFile, checkProfileIsValid } from '@/app/redux/configActions'
import { storeEditingProfileData, deleteEditingProfile } from '@/app/redux/configSlice'


import { Button } from '@material-ui/core';

import { useGlobalData } from '@/app/Context/DataContext';

import LoaderIcon from '@/app/Components/icons/Loading/Loading'

interface SubmitButtons {
    setOpen: any
}
const SaveDeleteButtons = ({ setOpen }: SubmitButtons) => {
    const dispatch = useAppDispatch()
    const { editingProfile, config } = useAppSelector(state => state.config);

    const dataState = useGlobalData()
    const { actions: { updateAllData }, data: { isSyncing } } = dataState
    const [, setLoaderIcon] = useState(false)

    const callback = () => setOpen(true)

    const setProfileConfig = async () => {
        const { status, message } = checkProfileIsValid(editingProfile)

        if (status) {
            setLoaderIcon(true)
            try {
                dispatch(storeEditingProfileData())
                const cfg = await storeConfigInFile()
                if (cfg) {
                    await updateAllData(1000, callback)
                }
                return
            } catch (error) {
                console.error(error)
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
                    const profileKeys = Object.keys(config.profiles)
                    if (profileKeys.length <= 1) {
                        alert('Hold on cowboy. You seem to be trying to delete your last profile. If you want to reset your data use Menu > Help > Reset all data.')
                        return
                    }
                    const accept = confirm("Deleting this profile will delete all information attached to it including API keys, and the database. This action will not impact your 3Commas account in any way. Confirm you would like to locally delete this profile.");
                    if (accept) {

                        console.log('deleted the profile!')

                        dispatch(deleteEditingProfile())
                        storeConfigInFile();

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