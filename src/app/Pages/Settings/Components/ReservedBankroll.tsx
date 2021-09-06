import React, { useEffect, useState, useMemo } from 'react';
// import { DataGrid } from '@material-ui/data-grid';
import { Switch } from '@material-ui/core';

import { CustomTable } from '@/app/Components/DataTable/Index'
import styled from 'styled-components'


import { Type_ReservedFunds } from '@/types/config';

import { useGlobalState } from '@/app/Context/Config';

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
                background-color: var(--color-secondary-light25);
                color: var(--color-text-darkbackground);
              }
                background-color: var(--color-secondary-light25);
                color: var(--color-text-darkbackground);
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
      id:string
    }
    updateReservedFunds: any
  }
  
  // Create an editable cell renderer
  const EditableCell = ({
    value: initialValue,
    row: { original },
    column: { id: column },
    updateReservedFunds, // This is a custom function that we supplied to our table instance
  }:Cell) => {
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
  
    return <input value={value} onChange={onChange} onBlur={onBlur} style={{textAlign: 'center', color: 'var(--color-text-lightbackground)'}}/>
  }

const ReservedBankroll = () => {

    // config state
    const configState = useGlobalState()
    const { state: { reservedFunds, updateReservedFunds } } = configState

    const columns = useMemo(
        () => [
          {
            Header: 'Enabled?',
            accessor: 'is_enabled',
            Cell: ({ cell }: any) => ( <Switch
                    checked={cell.value}
                    color="primary"
                    onClick={handleOnOff}
                    name={String(cell.row.original.id)}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                /> )
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
        updateReservedFunds((prevState: Type_ReservedFunds[]) => {
            return prevState.map(row => {
                if (e != undefined && e.target !== null) {
                    if (e.target.name == row.id) {
                      console.log(row.is_enabled)
                        row.is_enabled = !row.is_enabled
                      }
                }
                return row
            })
        })
    }

    const handleEditCellChangeCommitted = (id:number, column:string, value:string, original:Type_ReservedFunds) => {

        updateReservedFunds((prevState: Type_ReservedFunds[]) => {
            return prevState.map(row => {
                if (id == row.id) {

                    // @ts-ignore - validate props
                    row[column] = value
                    // console.log(`changed ${e.field} to ${e.value}`)

                }
                return row
            })
        })
    }

    return (
        <div style={{ display: 'flex', overflow: "visible", width: "100%", alignSelf: "center" }}>
            <div className="settings-dataGrid"   >

                <Styles>
                    <CustomTable
                        columns={columns}
                        data={reservedFunds}
                        disableMultiSort={true}
                        autoResetSortBy={false}
                        // autoResetPage={false}
                        manualSortBy={true}
                        updateReservedFunds={handleEditCellChangeCommitted}
                        // skipPageReset={skipPageReset}
                        //@ts-ignore
                        getHeaderProps={column => ({
                            // onClick: () => setSort(column.id),
                            style: {
                                height: '44px',

                            },

                        })}
                        //@ts-ignore
                        getColumnProps={column => ({

                        })}
                        //@ts-ignore
                        getRowProps={row => ({

                        })}
                        //@ts-ignore
                        getCellProps={cellInfo => ({

                            style: {
                                color: (cellInfo.column.id === 'actual_usd_profit' || cellInfo.column.id === 'actual_profit_percentage') ? (cellInfo.row.original.in_profit) ? 'var(--color-green)' : 'var(--color-red)' : null,
                                fontWeight: (cellInfo.column.id === 'actual_usd_profit' || cellInfo.column.id === 'actual_profit_percentage') ? '600' : null
                            }

                        })}
                    />
                </Styles>
            </div>
        </div>
    );
}

export default ReservedBankroll;