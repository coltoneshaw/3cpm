import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { storeConfigInFile, checkProfileIsValid, deleteProfileByIdGlobal } from '@/app/redux/configActions'
import { storeEditingProfileData, deleteProfileById } from '@/app/redux/configSlice'
import {updateAllData} from '@/app/redux/threeCommas/Actions'


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
                const cfg = await storeConfigInFile()
                if (cfg) {
                    await updateAllData(1000, editingProfile, 'fullSync')
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