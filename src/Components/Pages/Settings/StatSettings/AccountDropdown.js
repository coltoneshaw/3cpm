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
    const { config, refs: { accountIDPicker } } = state;

    const [select, changeSelect] = useState("")

    // fetching account Data
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

    /**
     * TODO
     * - Update this to move update from the config each time it changes. Right now it's only on the FIRST ress
     */
    useEffect(() => {
        changeSelect(findData(config, accountIdPath))
    }, [config])


    // changing the select value
    const handleChange = (event) => {
        changeSelect(event.target.value)
        console.log(accountData)
        console.log('changing the default account ID')
    };

    return (
        <FormControl >
            <InputLabel>Account Filter</InputLabel>
            <Select
                value={select}
                onChange={handleChange}
                inputRef={accountIDPicker}
            >
             <MenuItem value="">    </MenuItem>

                {/* Add filter here that if it's an array of 1 or the value is not defined in the config then we just pick accounts[0] */}
                {accountData.map(a => <MenuItem value={a.account_id} key={a.account_id}>{a.account_name}</MenuItem>)}

            </Select>
        </FormControl>
    )



}

export default AccountDropdown