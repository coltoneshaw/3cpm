import React, { useContext, useState, useEffect } from 'react';
import dotProp from 'dot-prop';

import {
    TextField,
} from '@material-ui/core';

import { useGlobalState } from '../../../../Context/Config';


const ApiSettings = () => {
    const state = useGlobalState();
    const { state: { updateApiData, apiData }, config } = state

    const updateKeys = (config) => {
        if(dotProp.has(config, 'apis.threeC')) return config.apis.threeC
        return {key: '', secret: ''}
    }

    // const [ apiKeyState, updateKey ] = useState(updateKeys(config))


    useEffect(()=>{
        updateApiData(updateKeys(config));
     },[config]);

    const handleKeyChange = (e) => {
        console.log(e.target.value)
        updateApiData(prevState => {
            return {
                ...prevState,
                key: e.target.value
            }
        })
    }

    const handleSecretChange = (e) => {
        console.log(e.target.value)
        updateApiData(prevState => {
            return {
                ...prevState,
                secret: e.target.value
            }
        })
    }


    return (
        <div className=" flex-column">
            <h2>API Settings</h2>
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