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


    return (
        <div className=" flex-column">
            <h2>API Settings</h2>
            <TextField
                id="key"
                label="Key"
                defaultValue={apiData.key}
            />
            <TextField
                id="secret"
                label="Secret"
                defaultValue={apiData.secret}
            />
        </div>
    )
}

export default ApiSettings;