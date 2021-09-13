import React, { useEffect, useState } from "react";

import { TextField } from '@material-ui/core';
import { returnCurrentProfile, updateProfileConfig } from '@/app/Context/Config/HelperFunctions';


const ProfileName = ({currentName,currentProfileId}: { currentName: string, currentProfileId:any }) => {

    const [name, updateName] = useState('')

    const handleChange = (e: any) => {
        updateName(e.target.value)
        updateProfileConfig(currentProfileId, {name})

    }

    useEffect( () => {
        updateName(currentName)
    }, [currentName])


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

export default ProfileName;