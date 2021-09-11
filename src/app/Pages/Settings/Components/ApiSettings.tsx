import React, { useEffect } from 'react';
import dotProp from 'dot-prop';

import {TextField, Button, InputLabel, FormControl, MenuItem, Select} from '@material-ui/core';

import { useGlobalState } from '@/app/Context/Config';
import {Type_ApiKeys, Type_Profile} from '@/types/config'


const ApiSettings = () => {
    const { state: { updateApiData, apiData }, currentProfile, actions: { fetchAccountsForRequiredFunds } } = useGlobalState();


    const updateKeys = (profile: Type_Profile) => {
        if (dotProp.has(profile, 'apis.threeC'))
            return profile.apis.threeC
        return { key: '', secret: '', mode: 'real' }
    }



    useEffect(() => {
        updateApiData(updateKeys(currentProfile));
    }, [currentProfile]);

    const handleChange = (e: any) => {
        if(!e.target.name) {
            console.debug('Failed to change API setting due to blank name')
            console.debug(e)
            return
        }

        const validKeys = ['key', 'secret', 'mode']
        updateApiData((prevState: Type_ApiKeys) => {
            let newState = {...prevState}

            if(!validKeys.includes(e.target.name)) return prevState

            newState[e.target.name as keyof Type_ApiKeys] = e.target.value
            return newState
        })

    }


    return (
        <div className=" flex-column settings-child">
            <h2 className="text-center ">API Settings</h2>
            <p className="subText">This app requires "Bots read", "Smart trades read", and "Accounts read" within 3commas.</p>
            <div className=" flex-row" style={{paddingBottom: "25px"}} >
                <TextField
                    id="key"
                    label="Key"
                    name="key"
                    value={apiData.key}
                    onChange={handleChange}
                    className="settings-left"
                    style={{
                        marginRight: "15px",
                        flexBasis: "50%"
                    }}
                />
                <TextField
                    id="secret"
                    label="Secret"
                    name="secret"
                    value={apiData.secret}
                    onChange={handleChange}
                    type="password"
                    style={{
                        marginLeft: "15px",
                        flexBasis: "50%"
                    }}
                />
            </div>

            <div className=" flex-row" style={{paddingBottom: "25px"}} >
                <FormControl   style={{marginRight: "15px",flexBasis: "50%"}}>
                    <InputLabel id="mode-label">Mode</InputLabel>
                    <Select
                        labelId="mode-label"
                        id="mode"
                        name="mode"
                        value={apiData.mode}
                        onChange={handleChange}
                    >
                        <MenuItem value={"real"}>Real</MenuItem>
                        <MenuItem value={"paper"}>Paper</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <Button
                className="CtaButton"
                disableElevation
                onClick={
                    async () => {
                        // @ts-ignore
                        // await electron.api.getAccountData()
                        let key = apiData.key
                        let secret = apiData.secret
                        let mode = apiData.mode
                        try {
                            await fetchAccountsForRequiredFunds(key, secret, mode)
                        } catch (error) {
                            alert('there was an error testing the API keys. Check the console for more information.')
                        }
                    }
                    // fetch all accounts from the API
                    // store these accounts in the database
                    // update the accountData property & the reserved funds.
                    // update the table on the page.
                }
                style={{
                    margin: "auto",
                    borderRight: 'none',
                    width: '150px'
                    }}
                >
                Test API Keys
            </Button>

        </div>
    )
}

export default ApiSettings;