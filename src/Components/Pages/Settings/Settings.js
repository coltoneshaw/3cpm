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



// const SettingsPage = () => {
//     apiKey = React.createRef();
//     apiSecret = React.createRef();

//     return (
//         <>
//             <h1>Settings</h1>
//             <div className="settings-div boxData flex-column">
//                 <ApiSettings refs={{ apiKey, apiSecret  }}/>


//                 <div className="flex-column">
//                     <h2>General Settings:</h2>
//                     <CurrencySelector currency={this.state.defaultCurrency} />
//                 </div>

//                 <SaveSubmitButtons />

//                 {/* These buttons still need to be wired up, but for now they are displayed. */}
//                 <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ margin: 'auto' }}>
//                     <Button style={{ margin: '25px', borderRight: 'none' }}>Leave Feedback</Button>
//                     <Button style={{ margin: '25px' }}>Report a Bug</Button>
//                 </ButtonGroup>
//             </div>

//         </>
//     )
// }


class SettingsPage extends Component {



    state = {
        currency: '',
        key: '',
        secret: '',
        config: '',
        defaultAccount: '',
        accountOptions: [],
        defaultStartDate: new Date()
    }




    render() {

        return (
            <>
                <h1>Settings</h1>
                <div className="settings-div boxData flex-column">
                    <ApiSettings />

                    <div className="flex-column">
                        <h2>General Settings:</h2>
                        <CurrencySelector/>
                    </div>
                    {/* Pull data from here onto the general config. */}
                    <StatSettingElements/>

                    <SaveSubmitButtons />

                    <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ margin: 'auto' }}>
                        <Button style={{ margin: '25px', borderRight: 'none' }}>Leave Feedback</Button>
                        <Button style={{ margin: '25px' }}>Report a Bug</Button>
                    </ButtonGroup>


                </div>
            </>


        )

    }

}

export default SettingsPage;