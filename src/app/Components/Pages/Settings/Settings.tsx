import React, { Component } from 'react';

import {
    ButtonGroup
} from '@material-ui/core';

import Button from '@material-ui/core/Button';

import './Settings.scss';


import CurrencySelector from './Components/CurrencySelector';
import SaveSubmitButtons from './Components/SaveSubmitButtons';
import ApiSettings from './Components/ApiSettings';
import StatSettingElements from './StatSettings'



const SettingsPage = () => {

    return (
        <>
            <h1>Settings</h1>
            <div className="settings-div boxData flex-column" style={{overflow: "visible"}}>
                <ApiSettings />
                <div className="flex-column">
                    <h2>General Settings:</h2>
                    <CurrencySelector />
                </div>
                <StatSettingElements/>

                <SaveSubmitButtons />

                {/* These buttons still need to be wired up, but for now they are displayed. */}
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ margin: 'auto' }}>
                    <Button onClick={() => window.open('https://forms.gle/2ihxsQtvG1yexPxW6')}  style={{ margin: '25px', borderRight: 'none' }} >Leave Feedback</Button>
                    <Button onClick={() => window.open('https://forms.gle/CfzMy8E6zUe8UuzBA')} style={{ margin: '25px' }}>Report a Bug</Button>
                </ButtonGroup>
            </div>

        </>
    )
}



export default SettingsPage;