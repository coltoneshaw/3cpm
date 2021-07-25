import React, { useState, useEffect } from 'react';
import dotProp from 'dot-prop';
import 'date-fns';
import StartDatePicker from './StartDatePicker';
import AccountDropdown from './AccountDropdown'

// TODO
//- this may need to be moved into global state as well as it'll be updated across the app

/**
 * TODO Next
 * 
 * - Import the config store into the accountdropdown and start date picker
 * - config the accountDropdown to pull the accountData
 * - Remove the class from the settings element
 * 
 * 
 */

// import { accountDataAll } from '../../../../utils/3Commas';

// import { useGlobalState } from '../../../../Context/Config';




const StatSettingElements = () => {
    // const state = useGlobalState()
    // const { config, refs: { accountIDPicker, startDatePicker} } = state;

    // // finding the data that exists based on the dotprop.
   
    // // initializing a state for each of the two props that we are using.
    // const [ startDate, changeDate ] = useState(() => findData(config, accountIdPath))
    // const [ accountID, changeAccountID ] = useState(() => findData(config, startDatePath))

    
    // // using an effect to watch if the config updates.
    // useEffect(() =>{
    //     changeDate(findData(config, accountIdPath));
    //     changeAccountID(findData(config, startDatePath));

    // }, [config])



    return (
        <div className="flex-column">
            <h2>Stat Settings</h2>

            <StartDatePicker
                // onChangeEvent={props.onChangeEvent} 
                // defaultStartDate={new Date()}
             />

            <AccountDropdown 
                // onChangeEvent={props.onChangeEvent} 
            />

        </div>

    );
}

export default StatSettingElements;