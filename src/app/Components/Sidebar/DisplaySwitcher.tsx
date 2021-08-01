import React, { useState } from 'react';

import { Moon, Sun } from './Icons/Index'

const DisplaySwitcher = () => {

    const [ display, changeDisplay ] = useState(false)


    const displaySwitch = () => {
        console.log('switching display mode')

        changeDisplay(!display)

    }

        return (
            <div className="sidebarOption" id="displaySwitcher" onClick={() => displaySwitch()} >
                { (display) ? <Moon /> : <Sun /> }
            </div>
        )
}

export default DisplaySwitcher;