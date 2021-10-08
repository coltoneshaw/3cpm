import React, { useEffect, useState } from 'react';

import { updateReservedFundsArray, updateNestedCurrentProfile } from '@/app/redux/configActions';

import { TextField, Button, InputLabel, FormControl, MenuItem, Select } from '@mui/material';

import { Type_ReservedFunds } from '@/types/config'
import type {defaultTempProfile} from '@/app/Pages/Settings/Settings'

const ApiSettings = ({tempProfile, updateTempProfile}: {tempProfile: typeof defaultTempProfile, updateTempProfile: CallableFunction}) => {


    const handleChange = (e: any) => {
        const validKeys = ["key", 'secret', 'mode']

        if (!e.target.name || !validKeys.includes(e.target.name)) {
            console.debug('Failed to change API setting due to invalid config path.')
            console.debug(e)
            return
        }
        updateTempProfile((prevState: typeof defaultTempProfile) => {
            let newState = { ...prevState }

            //@ts-ignore
            newState[e.target.name as keyof typeof prevState] = e.target.value
            return newState
        })
    }

    const handleUpdatingReservedFunds = (reservedFunds: Type_ReservedFunds[]) => {
        updateTempProfile((prevState: typeof defaultTempProfile) => {
            let newState = { ...prevState }
            newState.reservedFunds = reservedFunds
            return newState
        })
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
                    value={tempProfile.key}
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
                    value={tempProfile.secret}
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
                        value={tempProfile.mode}
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
                        let key = tempProfile.key
                        let secret = tempProfile.secret
                        let mode = tempProfile.mode
                        try {
                            const reservedFunds = await updateReservedFundsArray(key, secret, mode, tempProfile.reservedFunds)
                            handleUpdatingReservedFunds(reservedFunds ?? [])
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