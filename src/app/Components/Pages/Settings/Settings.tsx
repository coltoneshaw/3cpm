import React, { Component } from 'react';

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

    return (
        <>
            {/* <h1>Settings</h1> */}
            <div className="settings-div boxData flex-column" style={{ overflow: "visible", margin: "auto" }}>
                <ApiSettings />
                <div className="flex-column settings-child">
                    <h2>General Settings:</h2>
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
                            

                            <p className="subText">Set your account filters and reserved funds below. Double click in the reserved fund box to update the value.</p>
                            <ReservedBankroll />

                        </div>

                    </div>

                </div>

                <SaveSubmitButtons setOpen={setOpen} />

                {/* These buttons still need to be wired up, but for now they are displayed. */}
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ margin: 'auto' }}>
                    <Button onClick={() => window.open('https://forms.gle/2ihxsQtvG1yexPxW6')} style={{ margin: '25px', borderRight: 'none' }} >Leave Feedback</Button>
                    <Button onClick={() => window.open('https://forms.gle/CfzMy8E6zUe8UuzBA')} style={{ margin: '25px' }}>Report a Bug</Button>
                </ButtonGroup>
            </div>
            <ToastNotifcation open={open} handleClose={handleClose} message="Config has been saved" />
        </>
    )
}



export default SettingsPage;