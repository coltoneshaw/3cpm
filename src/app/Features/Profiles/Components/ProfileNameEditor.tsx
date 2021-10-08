import React, { useEffect, useState } from "react";
import { TextField } from '@mui/material';

import type {defaultTempProfile} from '@/app/Pages/Settings/Settings'

const ProfileNameEditor = ({tempProfile, updateTempProfile}: {tempProfile: typeof defaultTempProfile, updateTempProfile: CallableFunction}) => {


    const handleChange = (e: any) => {
        updateTempProfile((prevState: typeof defaultTempProfile) => {
            let newState = { ...prevState }
            newState.name = e.target.value
            return newState
        })
    }

    return (
        <TextField
            id="ProfileName"
            label="Profile Name"
            name="ProfileName"
            value={tempProfile.name}
            onChange={handleChange}
            className="settings-left"
            style={{
                marginRight: "15px",
                width: '250px'
            }}
        />
    )
}

export default ProfileNameEditor;