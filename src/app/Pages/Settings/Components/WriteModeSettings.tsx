import React from "react";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";

import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { configPaths } from "@/app/redux/globalFunctions";
import { updateEditProfileByPath } from "@/app/Pages/Settings/Redux/settingsSlice";

function WriteModeSettings () {

    const writeEnabled = useAppSelector(state => state.settings.editingProfile.writeEnabled);
    const dispatch = useAppDispatch()
    function toggleWriteEnabled() {
        dispatch(updateEditProfileByPath({ data: !writeEnabled, path: configPaths.writeEnabled }))

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
                            checked={writeEnabled?? false}
                            color="primary"
                            onClick={toggleWriteEnabled}
                            value={true}
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