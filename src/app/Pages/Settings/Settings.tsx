import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
// import {get} from '@/app/redux/configSlice'
import './Settings.scss'

// @ts-ignore
import { version } from '#/package.json';

// import { useGlobalState } from '@/app/Context/Config';
// import { returnProfileById } from "@/app/Context/Config/HelperFunctions";
// import { Type_Profile } from '@/types/config';



import {
    ButtonGroup,
    Button
} from '@material-ui/core';

import {
    CurrencySelector,
    SaveDeleteButtons,
    ApiSettings,
    ReservedBankroll,
    StartDatePicker
} from './Components/Index'

import {ProfileNameEditor} from '@/app/Features/Profiles/Components/Index'


import { ChangelogModal, ToastNotifcations } from '@/app/Features/Index';



// Need to create an 'editing profile' state
// this state is either the current profile active, or the profile that was selected to be edited in the modal.
const SettingsPage = () => {

    const config = useAppSelector(state => state.config.config)
    const dispatch = useAppDispatch()

    // const configState = useGlobalState();
    // const { config, state: { currentlyEditingProfileId, currency, currentProfileId } } = configState;


    const [open, setOpen] = useState(false);

    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    // changelog state responsible for opening / closing the changelog
    const [openChangelog, setOpenChangelog] = useState(false);

    const handleOpenChangelog = () => {
        setOpenChangelog(true);
    };

 

    // let editingProfile = returnProfileById(currentlyEditingProfileId)

    // let profileId;

    // useEffect(() => {
    //     console.log('updating the ID from the settings', currentlyEditingProfileId)
    // }, [currentlyEditingProfileId])

    // useEffect(() => {
    //     console.log('this updated here')
    // }, [currentProfileId])

    return (
        <>
            {/* <h1>Settings</h1> */}
            <div className="settings-div boxData flex-column" style={{ overflow: "visible", margin: "auto" }}>
                <ProfileNameEditor  />
                <ApiSettings />
                <div className="flex-column settings-child">
                    <h2 className="text-center ">General Settings:</h2>
                    <div className="flex-row">
                        <div style={{
                            marginRight: "15px",
                            flexBasis: "50%"
                        }}>
                            <CurrencySelector />
                            <StartDatePicker />
                        </div>
                        <div style={{
                            marginLeft: "15px",
                            flexBasis: "50%"
                        }}>
                            

                            <p className="subText">Once you've tested the API keys be sure to enable an account below. In reserved funds you can set aside funds to be added / removed from DCA calculations. ex: ( -4000 will be added, 4000 will be removed.) Double click in the reserved fund box to update the value.</p>
                            <ReservedBankroll />

                        </div>

                    </div>

                </div>

                <SaveDeleteButtons setOpen={setOpen} />

                {/* These buttons still need to be wired up, but for now they are displayed. */}
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ margin: 'auto' }}>

                    {/* @ts-ignore */}
                    <Button onClick={() => electron.general.openLink('https://github.com/coltoneshaw/3c-portfolio-manager#feedback-or-bug-submission')} style={{ margin: '1em', borderRight: 'none' }} >Leave Feedback / Report a bug</Button>
                </ButtonGroup>
                <Button 
                    variant="text" color="primary" 
                    aria-label="text primary button" 
                    className="versionNumber" onClick={handleOpenChangelog} style={{ width: '250px' }}>{version}</Button>
            </div>
            <ChangelogModal open={openChangelog} setOpen={setOpenChangelog}/>
            <ToastNotifcations open={open} handleClose={handleClose} message="Config has been saved" />
        </>
    )
}



export default SettingsPage;