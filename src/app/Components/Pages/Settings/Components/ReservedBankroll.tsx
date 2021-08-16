import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Switch, Input } from '@material-ui/core';

import { MuiClassObject } from '@/app/Context/MuiClassObject'
import { Type_ReservedFunds } from '@/types/config';

import { useGlobalState } from '@/app/Context/Config';

const ReservedBankroll = () => {
    const classes = MuiClassObject()

    // config state
    const configState = useGlobalState()
    const { config, state: { reservedFunds, updateReservedFunds } } = configState


    const columns = [
        {
            field: 'is_enabled',
            headerName: 'Enabled?',
            flex: .75,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: any) => (
                <Switch
                    checked={params.row.is_enabled}
                    color="primary"
                    onClick={handleOnOff}
                    name={params.row.id.toString()}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            )
        },
        {
            field: 'account_name',
            headerName: 'Account Name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'reserved_funds',
            headerName: 'Reserved Funds',
            type: 'number',
            flex: 1,
            editable: true,
            headerAlign: 'center',
            align: 'center'
        }
    ];

    const handleOnOff = (e: any) => {
        updateReservedFunds((prevState: Type_ReservedFunds[]) => {
            return prevState.map(row => {
                if (e !== undefined && e.target !== null) {
                    if (e.target.name == row.id) {
                        row.is_enabled = !row.is_enabled
                    }
                }
                return row
            })
        })
    }

    const handleEditCellChangeCommitted = (e: any) => {

        updateReservedFunds((prevState: Type_ReservedFunds[]) => {
            return prevState.map(row => {
                if (e.id == row.id) {

                    // @ts-ignore - validate props
                    row[e.field] = e.value
                    // console.log(`changed ${e.field} to ${e.value}`)

                }
                return row
            })
        })
    }

    return (
        <div style={{ display: 'flex', overflow: "visible", width: "100%", alignSelf: "center" }}>
            <div className="settings-dataGrid"   >
                <DataGrid
                    autoHeight
                    className={classes.root}
                    hideFooter={true}
                    rows={reservedFunds}
                    // @ts-ignore
                    columns={columns}
                    disableColumnFilter
                    disableColumnSelector
                    disableColumnMenu
                    onCellEditCommit={handleEditCellChangeCommitted}
                    onError={(error) => console.log(error + 'error')}

                />
            </div>
        </div>
    );
}

export default ReservedBankroll;