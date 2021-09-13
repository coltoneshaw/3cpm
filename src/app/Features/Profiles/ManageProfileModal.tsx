import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Delete from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import TextField from '@material-ui/core/TextField';
import { TconfigValues } from '@/types/config'

import { useThemeProvidor } from "@/app/Context/ThemeEngine";

interface Type_profileModal {
    open: boolean
    setOpen: any
    profiles: TconfigValues["profiles"] | {}
    currentProfileId:string
}

const ManageProfileModal = ({ open, setOpen, profiles, currentProfileId }:Type_profileModal ) => {

    // TODO
    // - Add an edit button
    // - setup the delete button to properly delete the profile. Possibly trigger a warning
    // - add a set Current Profile button that controls the state in the back.

    
    const [inputValue, changeInputValue] = useState('')

    const handleClose = () => {
        setOpen(false);
    };

    const theme = useThemeProvidor()
    const { styles } = theme

    const handleChange = (e: any) => {
        if(!e.target.name) {
            console.debug('Nothing is currently set.')
            console.debug(e)
            return
        }

        console.log({
            name: e.target.name,
            value: e.target.value
        })



    }

    const addProfileDiv = () => {
        // if (selectedCoins.length >= 5) return <p style={{ fontWeight: 300, margin: 'auto' }}>Remove a coin to add another.</p>

        return (
            <>
                <TextField
                    id="key"
                    label="Add Profile"
                    name="key"
                    value={inputValue}
                    onChange={handleChange}
                    className="settings-left"
                    style={{
                        flexBasis: '90%', paddingRight: '2em', color: 'var(--color-text-lightbackground)'
                    }}
                />

                <AddIcon
                    style={{
                        flexBasis: '10%',
                        cursor: 'pointer'

                    }}
                    onClick={() => {
                        // addCoin()
                    }}
                />
            </>
        )
    }

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
                        // deleteCoin(coin)
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

                        <div className="addCoinDiv flex-row">

                            { addProfileDiv() }

                        </div>




                    </div>

                </div>

            </DialogContent>

        </Dialog>
    )
}

export default ManageProfileModal;
