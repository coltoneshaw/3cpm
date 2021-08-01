import React, { useContext, useState, useEffect } from 'react';
import dotProp from 'dot-prop';

import {
    TextField,
} from '@material-ui/core';

import { useGlobalState } from '@/app/Context/Config';
import  { TconfigValues, Type_ApiKeys } from '@/types/config'


const ApiSettings = () => {
    const state = useGlobalState();
    const { state: { updateApiData, apiData }, config } = state

    const updateKeys = (config: TconfigValues) => {
        if(dotProp.has(config, 'apis.threeC')) return config.apis.threeC
        return {key: '', secret: ''}
    }

    // const [ apiKeyState, updateKey ] = useState(updateKeys(config))


    useEffect(()=>{
        updateApiData(updateKeys(config));
     },[config]);

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
        <div className=" flex-column">
            <h2>API Settings</h2>
            <p className="subText">This app requires "Bots read", "Smart trades read", and "Accounts read" within 3commas.</p>
            <TextField
                id="key"
                label="Key"
                defaultValue={apiData.key}
                onChange={handleKeyChange}
            />
            <TextField
                id="secret"
                label="Secret"
                defaultValue={apiData.secret}
                onChange={handleSecretChange}
            />
        </div>
    )
}

export default ApiSettings;