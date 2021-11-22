import React, { useEffect, useState, useMemo } from 'react';
import { Switch } from '@mui/material';

import { CustomTable, Settings_EditableCell } from '@/app/Components/DataTable/Index';
const EditableCell = Settings_EditableCell;
import { Type_ReservedFunds } from '@/types/config';



import type { defaultTempProfile } from '@/app/Pages/Settings/Settings'
const ReservedBankroll = ({ tempProfile, updateTempProfile }: { tempProfile: typeof defaultTempProfile, updateTempProfile: CallableFunction }) => {

  const [reservedFunds, updateReservedFunds] = useState<Type_ReservedFunds[]>(() => tempProfile.reservedFunds)

  useEffect(() => {
    if(tempProfile.reservedFunds != reservedFunds) updateReservedFunds(tempProfile.reservedFunds)
  }, [tempProfile.reservedFunds])

  useEffect(() => {
    updateTempProfile((prevState: typeof defaultTempProfile) => {
      let newState = { ...prevState }
      newState.reservedFunds = reservedFunds
      return newState
    })

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

    updateReservedFunds(prevState => (
      prevState.map(row => {
        let newRow = { ...row }
        if (e.target.name == newRow.id) {
          newRow.is_enabled = !newRow.is_enabled
        }
        return newRow
      })
    ))
  }

  const handleEditCellChangeCommitted = (id: number, column: string, value: string) => {

    updateReservedFunds(prevState => (
      prevState.map(row => {
        const newRow = { ...row }
        if (id == newRow.id) {
          //@ts-ignore
          newRow[column] = value

        }
        return newRow
      })
    ))
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