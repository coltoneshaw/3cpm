import React, { useState, useEffect } from 'react';
import dotProp from 'dot-prop';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@material-ui/core';

import { accountDataAll } from '../../../../utils/3Commas';
import { useGlobalState } from '../../../../Context/Config';
import { defaultConfig } from '../../../../utils/defaultConfig';
const accountIdPath = 'statSettings.account_id'

// finding the data that exists based on the dotprop.
const findData = (config, path) => {
    console.log('running find data')
    console.log({ config, path })
    if (dotProp.has(config, path)) return dotProp.get(config, path)
    return ""
}

// initializing a state for each of the two props that we are using.




const AccountDropdown = () => {
    const state = useGlobalState()
    const { config, state: { accountID, updateAccountID }} = state;


    /**
     * TODO 
     * - Move this into the config element and pass it down, or pull from the data element.
     */
    const [accountData, changeAccountData] = useState([])
    useEffect(() => {
        let mounted = true
        accountDataAll()
            .then(data => {
                if (mounted) {

                    // removing duplicate accounts
                    data = Array.from(new Set(data.map(a => a.account_id)))
                        .map(id => data.find(a => a.account_id === id))
                    
                    changeAccountData(data)
                }

            })
        return () => mounted = false
    }, [])

    useEffect(() => {
        let defaultAccountID = findData(config, accountIdPath)

        if(defaultAccountID == "" && accountData.length > 0){
            selectElement( accountData[0].account_id )
        } else {
            selectElement(findData(config, accountIdPath))
        }
        
    }, [accountData])

    const [select, selectElement ] = useState(() => accountID)


    // changing the select value
    const handleChange = (event) => {
        updateAccountID(event.target.value)
        selectElement(event.target.value)
        console.log('changing the default account ID')
    };

    return (
        <FormControl >
            <InputLabel>Account Filter</InputLabel>
            <Select
                value={select}
                onChange={handleChange}
                // inputRef={accountIDPicker}
            >
             <MenuItem value=""></MenuItem>

                {/* Add filter here that if it's an array of 1 or the value is not defined in the config then we just pick accounts[0] */}
                {accountData.map(a => <MenuItem value={a.account_id} key={a.account_id}>{a.account_name}</MenuItem>)}

            </Select>
        </FormControl>
    )



}

export default AccountDropdown