import React from 'react';
import 'date-fns';
import StartDatePicker from './StartDatePicker';
import AccountDropdown from './AccountDropdown'

const StatSettingElements = () => {

    return (
        <div className="flex-column">
            <h2>Stat Settings</h2>
            <StartDatePicker/>
            <AccountDropdown />
        </div>
    );
}

export default StatSettingElements;