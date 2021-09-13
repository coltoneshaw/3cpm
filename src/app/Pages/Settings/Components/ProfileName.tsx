import React, { useEffect, useState } from "react";

import { TextField } from '@material-ui/core';

const ProfileName = ({currentName}: { currentName: string }) => {

    const [name, updateName] = useState('')

    const handleChange = (e: any) => {
        updateName(e.target.value)
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