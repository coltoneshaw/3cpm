import React, { SetStateAction, useContext } from 'react';

import { Button } from '@material-ui/core';

import { ConfigContext } from '@/app/Context/Config';

interface SubmitButtons {
    setOpen: any
}
const SaveSubmitButtons = ({setOpen}: SubmitButtons) => {
    const { reset, setConfigBulk } = useContext(ConfigContext)

    return (
        <div className="flex-row padding settingsButtonDiv" >
            <Button
                variant="contained"
                onClick={() => {
                    reset()
                    setOpen(true)
                }}
                disableElevation
            >
                Reset
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={ () => {
                    setConfigBulk() 
                    setOpen(true)
                }}
                disableElevation
            >
                Save
            </Button>
        </div>
    )
}

export default SaveSubmitButtons;