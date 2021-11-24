import React, { useEffect, useState, useMemo } from 'react';
import { Switch } from '@mui/material';

import { CustomTable, Settings_EditableCell } from '@/app/Components/DataTable/Index';
const EditableCell = Settings_EditableCell;
// import { Type_ReservedFunds } from '@/types/config';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { configPaths } from "@/app/redux/globalFunctions";
import { updateEditProfileByPath } from "@/app/Pages/Settings/Redux/settingsSlice";


// import type { defaultTempProfile } from '@/app/Pages/Settings/Settings'
const ReservedBankroll = () => {

  const reservedFunds = useAppSelector(state => state.settings.editingProfile.statSettings.reservedFunds);
  const dispatch = useAppDispatch()
  const handleChange = (data: any) => {
    dispatch(updateEditProfileByPath({ data, path: configPaths.statSettings.reservedFunds }))
  }

  const [localReservedFunds, updateLocalReservedFunds ] = useState(() => reservedFunds)

  useEffect(() => {
    handleChange(localReservedFunds);
  }, [localReservedFunds]);

  useEffect(() => {
    updateLocalReservedFunds(reservedFunds);
  }, [reservedFunds])


  const columns = useMemo(
    () => [
      {
        Header: 'Enabled?',
        accessor: 'is_enabled',
        Cell: ({ cell }: any) => (<Switch
          checked={cell.value}
          color="primary"
          onClick={handleOnOff}
          name={String(cell.row.original.id)}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />)
      },
      {
        Header: 'Account Name',
        accessor: 'account_name'
      },
      {
        Header: 'Reserved Funds',
        accessor: 'reserved_funds',
        Cell: EditableCell,

      }
    ],
    []
  )


  const handleOnOff = (e: any) => {
    updateLocalReservedFunds( prevState => prevState.map(row => {
      let newRow = { ...row }
      if (e.target.name == newRow.id) newRow.is_enabled = !newRow.is_enabled
      return newRow
    })
    );
  }

  const handleEditCellChangeCommitted = (id: number, column: string, value: string) => {
    updateLocalReservedFunds( prevState => prevState.map(row => {
      const newRow = { ...row }
      if (id == newRow.id) {
        //@ts-ignore
        newRow[column] = value
      }
      return newRow
    })
    )
  }

  return (
    <div style={{ display: 'flex', overflow: "none", width: "100%", alignSelf: "center" }}>
      <div className="settings-dataGrid"   >
        <div className="dataTableBase">
          <CustomTable
            columns={columns}
            data={reservedFunds}
            updateReservedFunds={handleEditCellChangeCommitted}
            getHeaderProps={() => ({
              style: {
                height: '44px',
                backgroundColor: 'var(--color-secondary-light87)',
                zIndex: '1000',
              }
            })}
            getColumnProps={() => ({})}
            getRowProps={() => ({})}
            //@ts-ignore
            getCellProps={cellInfo => ({})}
          />
        </div>
      </div>
    </div>
  );
}

export default ReservedBankroll;