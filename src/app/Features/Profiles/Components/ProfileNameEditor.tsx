import React, { useEffect, useState } from "react";
import { TextField } from '@mui/material';
import { useAppSelector } from '@/app/redux/hooks';
import {configPaths } from "@/app/redux/configSlice";

import { updateNestedCurrentProfile } from "@/app/redux/configActions";


const ProfileNameEditor = () => {
    const profile = useAppSelector(state => state.config.currentProfile)
    const [name, updateName] = useState('')

    const handleChange = (e: any) => {
        updateName(e.target.value)
        updateNestedCurrentProfile(e.target.value, configPaths.name)
    }

    useEffect(() => {
        updateName(profile.name)
    }, [profile])

    return (
        <TextField
            id="ProfileName"
            label="Profile Name"
            name="ProfileName"
            value={name}
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