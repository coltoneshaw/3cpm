import React, { useContext } from 'react';

import { Button } from '@material-ui/core';

import { ConfigContext } from '../../../../Context/Config';
const SaveSubmitButtons = () => {
    const { reset, setConfigBulk } = useContext(ConfigContext)

    return (
        <div className="flex-row padding settingsButtonDiv" >
            <Button
                variant="contained"
                onClick={() => reset()}
                disableElevation
            >
                Reset
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={ () => setConfigBulk() }
                disableElevation
            >
                Save
            </Button>
        </div>
    )
}

export default SaveSubmitButtons;