import React, { useEffect, useState, useMemo } from 'react';
// import { DataGrid } from '@material-ui/data-grid';
import { Switch } from '@mui/material';

import { CustomTable } from '@/app/Components/DataTable/Index'
import styled from 'styled-components'
import { useAppSelector } from '@/app/redux/hooks';

import { configPaths } from '@/app/redux/configSlice'
import { updateNestedEditingProfile } from '@/app/redux/configActions';
import { Type_ReservedFunds } from '@/types/config';


const Styles = styled.div`

  table {
    border-spacing: 0;
    background-color: var(--color-background-light);
    color: var(--color-text-lightbackground);
    font-size: .875em;

    th,
    td {
      margin: 0;
      padding: 0.2rem .2rem .5rem .5rem;
    }

    thead {
      background-color: var(--color-secondary-light87);
      .darkHeader {
        background-color: var(--color-secondary-light75);
      }
    }

    
    tbody{

      input {
        font-size: .875rem;
        padding: 0;
        margin: 0;
        border: 0;
        background-color: var(--color-background-light);
      }

        tr {
            :nth-child(2n+2) {
                background-color: var(--color-secondary-light87);

                input {
                  background-color: var(--color-secondary-light87);
                }
            }
    
            :hover {
              input {
                background-color: var(--color-secondary-light25) !important;
                color: var(--color-text-darkbackground) !important;
              }
                background-color: var(--color-secondary-light25);
                color: var(--color-text-darkbackground);

                .MuiSwitch-thumb {
                  background-color: darkgrey !important;
                }
            }
        };

        }
    }

    
  }
`

interface Cell {
  value: {
    initialValue: string
  }
  row: {
    original: Type_ReservedFunds,
  }
  column: {
    id: string
  }
  updateReservedFunds: any
}

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { original },
  column: { id: column },
  updateReservedFunds, // This is a custom function that we supplied to our table instance
}: Cell) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(String(initialValue))
  // const [size, setSize] = useState(() => String(initialValue).length * 1.5)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)


  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateReservedFunds(original.id, column, value, original)
  }

  useEffect(() => {
    setValue(String(initialValue))
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} style={{ textAlign: 'center', color: 'var(--color-text-lightbackground)' }} />
}

const ReservedBankroll = () => {

  const profile = useAppSelector(state => state.config.editingProfile);
  const [reservedFunds, updateReservedFunds] = useState<Type_ReservedFunds[]>([])

  useEffect(() => {
    if (profile.statSettings.reservedFunds) updateReservedFunds(profile.statSettings.reservedFunds)

  }, [profile])

  useEffect(() => {
    
  }, [reservedFunds])

  const updateData = (data:Type_ReservedFunds[]) => {
    updateNestedEditingProfile(data, configPaths.statSettings.reservedFunds)
    return data
  }


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
      updateData(prevState.map(row => {
        let newRow = {...row}
        if (e.target.name == newRow.id) {
          newRow.is_enabled = !newRow.is_enabled
        }
        return newRow
      })
    )))
  }

  const handleEditCellChangeCommitted = (id: number, column: string, value: string) => {

    updateReservedFunds(prevState => (
      updateData(prevState.map(row => {
        const newRow = {...row}
        if (id == newRow.id) {
          //@ts-ignore
          newRow[column] = value

        }
        return newRow
      })
    )))
  }

  return (
    <div style={{ display: 'flex', overflow: "none", width: "100%", alignSelf: "center" }}>
      <div className="settings-dataGrid"   >

        <Styles>
          <CustomTable
            columns={columns}
            data={reservedFunds}
            updateReservedFunds={handleEditCellChangeCommitted}
            getHeaderProps={() => ({
              style: {
                height: '44px',
              },
            })}
            getColumnProps={() => ({})}
            getRowProps={() => ({})}
            //@ts-ignore
            getCellProps={cellInfo => ({})}
          />
        </Styles>
      </div>
    </div>
  );
}

export default ReservedBankroll;