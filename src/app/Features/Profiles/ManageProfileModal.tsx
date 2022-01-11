import React, { useState } from "react";

import { useAppSelector } from '@/app/redux/hooks';
import { deleteProfileByIdGlobal } from '@/app/redux/config/configActions'

import {
    Dialog,
    DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';

// import TextField from '@mui/material/TextField';
import { TconfigValues } from '@/types/config'

import { useThemeProvidor } from "@/app/Context/ThemeEngine";

interface Type_profileModal {
    open: boolean
    setOpen: any
    profiles: TconfigValues["profiles"] | {}
    currentProfileId:string
}

const ManageProfileModal = ({ open, setOpen, profiles }:Type_profileModal ) => {

    const {config} = useAppSelector(state => state.config)

    // TODO
    // - Add an edit button
    // - setup the delete button to properly delete the profile. Possibly trigger a warning
    // - add a set Current Profile button that controls the state in the back.

    
    const handleClose = () => {
        setOpen(false);
    };

    const theme = useThemeProvidor()
    const { styles } = theme

    const returnProfilesMapped = () => {

        if(!profiles) return <></>


       return Object.keys(profiles).map(p => {

            // @ts-ignore
            // TODO - need to go back and make this a key of profiles properly
            const mappedProf = profiles[p]
            
            return (
            <div className="flex-row selectedCoinDiv" key={p}>
                <p style={{ flexBasis: '90%' }}>{mappedProf.name}</p>
                <Delete
                    style={{
                        flexBasis: '10%',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        deleteProfileByIdGlobal(config, p, undefined)
                    }}
                />
            </div>
        )})

    }


    return (
        <Dialog
            fullWidth={false}
            maxWidth="md"
            open={open}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
            style={{

                color: 'var(--color-text-lightbackground)',
                padding: 0,
                ...styles,

            }}
        >
            <DialogContent style={{ padding: 0 }}>
                <div className="flex-row addCoinModal">
                    <CloseIcon className="closeIcon" onClick={handleClose} />

                    <div className="flex-column" style={{
                        width: '100%'
                    }}>
                        <h2 style={{ textAlign: 'center' }}>Profiles</h2>

                        { returnProfilesMapped() }

                    </div>

                </div>

            </DialogContent>

        </Dialog>
    )
}

export default ManageProfileModal;
