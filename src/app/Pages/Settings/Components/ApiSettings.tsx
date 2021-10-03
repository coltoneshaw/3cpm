import React, { useEffect, useState } from 'react';

import {  useAppSelector } from '@/app/redux/hooks';
import {  configPaths } from '@/app/redux/configSlice'
import { updateReservedFundsArray, updateNestedCurrentProfile } from '@/app/redux/configActions';

import { TextField, Button, InputLabel, FormControl, MenuItem, Select } from '@mui/material';

import { Type_Profile, Type_ReservedFunds } from '@/types/config'


const ApiSettings = () => {
    const {currentProfile, reservedFunds} = useAppSelector(state => state.config);
    const [apiData, updateApiData] = useState(() => ({ key: "", mode: "", secret: "" }))

    useEffect(() => {
        updateApiData(currentProfile.apis.threeC)
    }, [currentProfile])

    const handleChange = (e: any) => {
        const validKeys = ["key", 'secret', 'mode']

        if (!e.target.name || !validKeys.includes(e.target.name)) {
            console.debug('Failed to change API setting due to invalid config path.')
            console.debug(e)
            return
        }
        updateApiData((prevState) => {
            let newState = { ...prevState }
            //@ts-ignore
            newState[e.target.name as keyof Type_Profile] = e.target.value

            updateNestedCurrentProfile(newState, configPaths.apis.threeC.main)
            return newState
        })
    }

    const handleUpdatingReservedFunds = (reservedFunds: Type_ReservedFunds[]) => {
        updateNestedCurrentProfile(reservedFunds, configPaths.statSettings.reservedFunds)
    }


    return (
        <div className=" flex-column settings-child">
            <h2 className="text-center ">API Settings</h2>
            <p className="subText">This app requires "Bots read", "Smart trades read", and "Accounts read" within 3commas.</p>
            <div className=" flex-row" style={{ paddingBottom: "25px" }} >
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

            <div className=" flex-row" style={{ paddingBottom: "25px" }} >
                <FormControl style={{ flexBasis: "50%" }} fullWidth>
                    <InputLabel id="mode-label">Mode</InputLabel>
                    <Select
                        labelId="mode-label"
                        id="mode"
                        name="mode"
                        label="Mode"
                        value={apiData.mode}
                        onChange={handleChange}
                        style={{
                            marginRight: '15px'
                        }}
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
                        let key = apiData.key
                        let secret = apiData.secret
                        let mode = apiData.mode
                        try {
                            await updateReservedFundsArray(key, secret, mode, handleUpdatingReservedFunds, reservedFunds)
                        } catch (error) {
                            alert('there was an error testing the API keys. Check the console for more information.')
                        }
                    }
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