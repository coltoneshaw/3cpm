import React, { useState } from 'react';

import { Moon, Sun } from './Icons/Index'

import { useThemeProvidor } from '@/app/Context/ThemeEngine'

const DisplaySwitcher = () => {

    const [ display, changeDisplay ] = useState(false)
    const theme = useThemeProvidor()
    const { changeTheme } = theme


    const displaySwitch = () => {
        console.log('switching display mode')

        changeDisplay(!display)
        changeTheme()

    }

        return (
            <div className="sidebarOption" id="displaySwitcher" onClick={() => displaySwitch()} >
                { (display) ? <Moon /> : <Sun /> }
            </div>
        )
}

export default DisplaySwitcher;