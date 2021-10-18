import React from "react";
import {defaultTempProfile} from "@/app/Pages/Settings/Settings";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";

function WriteModeSettings ({tempProfile, updateTempProfile}: {tempProfile: typeof defaultTempProfile, updateTempProfile: CallableFunction}) {
    function toggleWriteEnabled() {
        updateTempProfile((old: typeof defaultTempProfile) => {
            return {...old, writeEnabled: !old.writeEnabled}
        })
    }

    return (<div className="flex-column settings-child">
            <h2 className="text-center ">Write mode:</h2>
            <div className="flex-row">
                <div>
                    <p className="subText">
                        By activating the write mode, you will allow 3CPM to perform write operations on your 3CPM account. 3CPM will never perform any action without asking confirmation.
                    </p>

                    <FormGroup>
                        <FormControlLabel control={ <Switch
                            checked={tempProfile.writeEnabled}
                            color="primary"
                            onClick={toggleWriteEnabled}
                            name="write-mode"
                            inputProps={{ 'aria-label': 'enable write mode' }}
                        />} label="Enable write mode" />
                    </FormGroup>


                </div>
            </div>

        </div>
    )
}


export default WriteModeSettings