import React, { Component } from 'react';

import { Moon, Sun } from './Icons'

class DisplaySwitcher extends Component {

    state = {
        darkMode: false
    }

    displaySwitch = () =>{
        console.log('switching display mode')

        this.setState(prevState => {
            return ({
                darkMode: !prevState.darkMode
            })
        });
    }


    render (){
        return (
            <div className="sidebarOption" id="displaySwitcher" onClick={() => this.displaySwitch()} >
                { (this.state.darkMode) ? <Moon /> : <Sun /> }
            </div>
        )
    }
}

export default DisplaySwitcher;