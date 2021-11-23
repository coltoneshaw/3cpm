import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { updateConfig, deleteProfileByIdGlobal, storeConfigInFile, updateNestedCurrentProfile } from '@/app/redux/configActions'
import { syncNewProfileData } from '@/app/redux/threeCommas/Actions'
import { configPaths } from '@/app/redux/configSlice';


import { Button } from '@mui/material';


import LoaderIcon from '@/app/Components/icons/Loading/Loading'
import type {defaultTempProfile} from '@/app/Pages/Settings/Settings'

interface SubmitButtons {
    setOpen: any
    tempProfile: typeof defaultTempProfile,
}

const checkProfileIsValid = (tempProfile: typeof defaultTempProfile) => {
    const {key, mode, secret, reservedFunds, name, startDate, defaultCurrency} = tempProfile
    if (!key || !mode || !secret) return { status: false, message: 'Missing 3Commas API information' }
    if (!name) return { status: false, message: 'Missing a valid profile name' }
    if (!reservedFunds) return { status: false, message: 'Missing accounts. Make sure to click "Test API Keys" and enable an account.' }
    if (reservedFunds.filter(account => account.is_enabled).length == 0) return { status: false, message: 'Missing an enabled account under reserved funds.' }
    if (!startDate) return { status: false, message: 'Missing a start date' }
    if (!defaultCurrency || defaultCurrency.length === 0) return { status: false, message: 'Missing a valid currency. Please select one before you can continue.' }

    return { status: true}

}

const SaveDeleteButtons = ({ setOpen, tempProfile }: SubmitButtons) => {
    const { currentProfile, config } = useAppSelector(state => state.config);

    const { isSyncing } = useAppSelector(state => state.threeCommas);
    const [, setLoaderIcon] = useState(false)

    const callback = () => setOpen(true)

    const setProfileConfig = async () => {
        const { status, message } = checkProfileIsValid(tempProfile)
        if (status) {
            const {key, mode, secret, reservedFunds, name, startDate, defaultCurrency, writeEnabled} = tempProfile
            updateNestedCurrentProfile(reservedFunds, configPaths.statSettings.reservedFunds);
            updateNestedCurrentProfile({key, mode, secret}, configPaths.apis.threeC.main);
            updateNestedCurrentProfile(name, configPaths.name);
            updateNestedCurrentProfile(startDate, configPaths.statSettings.startDate);
            updateNestedCurrentProfile(defaultCurrency, configPaths.general.defaultCurrency);
            updateNestedCurrentProfile(writeEnabled, configPaths.writeEnabled);
            setLoaderIcon(true)
            try {

                // saving the config here so the update function below can work properly
                //updating the current profile's data
                const update = await syncNewProfileData(1000);
                if (update) {
                    await window.ThreeCPM.Repository.Config.set('current', currentProfile.id)
                    updateConfig();
                    callback();
                }
            } catch (error) {

                // if there is an error storing the current profile, the data from the database gets deleted.
                await window.ThreeCPM.Repository.Database.deleteAllData(currentProfile.id)
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
                onClick={() =>  setProfileConfig()}
                disableElevation
            >
                {(isSyncing) ? <> Syncing... <LoaderIcon /> </> : "Save Profile"}
            </Button>
        </div>
    )
}

export default SaveDeleteButtons;