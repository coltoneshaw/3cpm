import React, { useState } from 'react';

import { Moon, Sun } from '@/app/Components/icons/Index';

import { useThemeProvidor } from '@/app/Context/ThemeEngine';

const DisplaySwitcher = () => {

    const [ display, changeDisplay ] = useState(false)
    const { changeTheme } = useThemeProvidor()
  

    const displaySwitch = () => {
        changeDisplay(!display)
        changeTheme()
    }

        return (
            <div className="sidebarOption" id="displaySwitcher" onClick={displaySwitch} >
                { (display) ? <Moon /> : <Sun /> }
            </div>
        )
}

export default DisplaySwitcher;