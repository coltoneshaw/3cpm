import React, { useState } from 'react';

// @ts-ignore
import { version } from '#/package.json';

import {
    ButtonGroup
} from '@material-ui/core';

import Button from '@material-ui/core/Button';

import './Settings.scss';


import CurrencySelector from './Components/CurrencySelector';
import SaveSubmitButtons from './Components/SaveSubmitButtons';
import ApiSettings from './Components/ApiSettings';

import ToastNotifcation from '@/app/Components/ToastNotification'
import ReservedBankroll from './Components/ReservedBankroll';
import StartDatePicker from './Components/StartDatePicker';

import { ChangelogModal } from '@/app/Features/Index';

const SettingsPage = () => {

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

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

    return (
        <>
            {/* <h1>Settings</h1> */}
            <div className="settings-div boxData flex-column" style={{ overflow: "visible", margin: "auto" }}>
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

                <SaveSubmitButtons setOpen={setOpen} />

                {/* These buttons still need to be wired up, but for now they are displayed. */}
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ margin: 'auto' }}>
                    <Button onClick={() => window.open('https://forms.gle/2ihxsQtvG1yexPxW6')} style={{ margin: '1em', borderRight: 'none' }} >Leave Feedback</Button>
                    <Button onClick={() => window.open('https://forms.gle/CfzMy8E6zUe8UuzBA')} style={{margin: '1em'}}>Report a Bug</Button>
                </ButtonGroup>
                <Button 
                    variant="text" color="primary" 
                    aria-label="text primary button" 
                    className="versionNumber" onClick={handleOpenChangelog} style={{ width: '250px' }}>v{version}</Button>
            </div>
            <ChangelogModal open={openChangelog} setOpen={setOpenChangelog}/>
            <ToastNotifcation open={open} handleClose={handleClose} message="Config has been saved" />
        </>
    )
}



export default SettingsPage;