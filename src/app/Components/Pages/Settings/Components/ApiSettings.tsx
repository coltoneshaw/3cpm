import React, { useContext, useState, useEffect } from 'react';
import dotProp from 'dot-prop';

import {
    TextField,
    Button
} from '@material-ui/core';

import { useGlobalState } from '@/app/Context/Config';
import { TconfigValues, Type_ApiKeys } from '@/types/config'

import { useGlobalData } from '@/app/Context/DataContext';


const ApiSettings = () => {
    const state = useGlobalState();
    const { state: { updateApiData, apiData }, config, actions: {fetchAccountsForRequiredFunds} } = state

    // const dataState = useGlobalData()
    // const { actions: { getAccountData} } = dataState;

    const updateKeys = (config: TconfigValues) => {
        if (dotProp.has(config, 'apis.threeC')) return config.apis.threeC
        return { key: '', secret: '' }
    }

    // const [ apiKeyState, updateKey ] = useState(updateKeys(config))


    useEffect(() => {
        updateApiData(updateKeys(config));
    }, [config]);

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
                    defaultValue={apiData.key}
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
                    defaultValue={apiData.secret}
                    onChange={handleSecretChange}
                    style={{
                        marginLeft: "15px",
                        flexBasis: "50%"
                    }}
                />
            </div>

            <Button 
                variant="contained"
                color="primary"
                disableElevation
                onClick={
                    async () => {
                        // @ts-ignore
                        // await electron.api.getAccountData()
                        try {
                            await fetchAccountsForRequiredFunds()
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