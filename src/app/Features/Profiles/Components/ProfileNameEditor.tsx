import React, { useEffect, useState } from "react";
import { TextField } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { storeEditingProfileData, setEditingProfile } from "@/app/redux/configSlice";


const ProfileNameEditor = () => {
    const profile = useAppSelector(state => state.config.editingProfile)
    const dispatch = useAppDispatch();
    const [editingProfile, updateEditingProfile] = useState(profile)

    const handleChange = (e: any) => {

        const tempProfile = {...profile, name: e.target.value}
        updateEditingProfile(tempProfile)
        dispatch(setEditingProfile(tempProfile))
        dispatch(storeEditingProfileData())
    }

    useEffect(() => {
        updateEditingProfile(profile)
    }, [profile])

    return (
        <TextField
            id="ProfileName"
            label="Profile Name"
            name="ProfileName"
            value={editingProfile.name}
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