import React, { useEffect } from 'react';
import dotProp from 'dot-prop';

import {TextField, Button, InputLabel, FormControl, MenuItem, Select} from '@material-ui/core';

import { useGlobalState } from '@/app/Context/Config';
import { TconfigValues, Type_ApiKeys } from '@/types/config'


const ApiSettings = () => {
    const state = useGlobalState();
    const { state: { updateApiData, apiData }, config, actions: { fetchAccountsForRequiredFunds } } = state


    const updateKeys = (config: TconfigValues) => {
        if (dotProp.has(config, 'apis.threeC')) return config.apis.threeC
        return { key: '', secret: '', mode: 'real' }
    }



    useEffect(() => {
        updateApiData(updateKeys(config));
    }, [config]);

    const handleModeChange = (e: any) => {
        updateApiData((prevState: Type_ApiKeys) => {
            return {
                ...prevState,
                mode: e.target.value
            }
        })
    }

    const handleKeyChange = (e: any) => {
        updateApiData((prevState: Type_ApiKeys) => {
            return {
                ...prevState,
                key: e.target.value
            }
        })
    }

    const handleSecretChange = (e: any) => {
        updateApiData((prevState: Type_ApiKeys) => {
            return {
                ...prevState,
                secret: e.target.value
            }
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
                    value={apiData.key}
                    onChange={handleKeyChange}
                    className="settings-left"
                    style={{
                        marginRight: "15px",
                        flexBasis: "50%"
                    }}
                />
                <TextField
                    id="secret"
                    label="Secret"
                    value={apiData.secret}
                    onChange={handleSecretChange}
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
                        value={apiData.mode}
                        onChange={handleModeChange}
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