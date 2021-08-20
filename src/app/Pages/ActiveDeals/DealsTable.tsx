import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CustomTable } from '@/app/Components/DataTable/Index'
import { getDateString } from '@/utils/helperFunctions';
import { parseNumber } from '@/utils/number_formatting';



const Styles = styled.div`
    overflow: scroll;

  table {
    border-spacing: 0;
    background-color: var(--color-background-light);
    color: var(--color-text-lightbackground);
    font-size: .875em;
    min-width: 1200px;

    th,
    td {
      margin: 0;
      padding: 0.3rem .2rem .3rem .2rem;
    }

    
    tbody{

        tr {
            :nth-child(2n+2) {
                background-color: var(--color-secondary-light87);
            }
    
            :hover {
                background-color: var(--color-secondary-light25);
                color: var(--color-text-darkbackground);

            }
        };

        .pill {
            padding: .1em;
            display: block;
            border-radius: 10px;
            color: white;
            font-weight: 700;
        }

        .red {
            background-color: var(--color-red);
            opacity: var(--opacity-pill);
        }

        .green {
            background-color: var(--color-green);
            opacity: var(--opacity-pill)
        }
    }


  }
`

function DealsTable({ data }: { data: object[] }) {

    const [localData, updateLocalData] = useState<object[]>([])

    useEffect(() => {
        updateLocalData(data)
    }, [data])


    const sortMe = (rowA: any, rowB: any, columnId: string, desc: boolean) => {
        return (rowA.original[columnId] > rowB.original[columnId]) ? -1 : 1
    }


    const columns = React.useMemo(
        () => [
            {
                Header: ' ',
                columns: [
                    {
                        Header: 'Bot Name',
                        accessor: 'bot_name', // accessor is the "key" in the data,
                        Cell: ({ cell }: any) => {
                            return (
                                <span
                                    data-text={cell.row.original.bot_settings}
                                    className="tooltip">
                                    {cell.value}
                                </span>
                            )
                        }
                    },
                    {
                        Header: 'Pair',
                        accessor: 'pair'
                    },
                    {
                        Header: 'Duration',
                        id: 'created_at',
                        accessor: 'created_at',
                        Cell: ({ cell }: any) => {
                            return <>{getDateString(cell.value)}</>
                        }
                    }
                ]
            },
            {
                Header: 'Price',
                columns: [
                    {
                        Header: 'Current',
                        accessor: 'current_price',
                        className: 'text-center',
                        sortType: (rowA: any, rowB: any, columnId: string, desc: boolean) => sortMe(rowA, rowB, columnId, desc),
                        Cell: ({ cell }: any) => {
                            return <>$ {parseNumber( cell.value, 4) }</>
                        }
                    },
                    {
                        Header: 'TP',
                        accessor: 'take_profit_price',
                        className: 'text-center',
                        sortType: (rowA: any, rowB: any, columnId: string, desc: boolean) => sortMe(rowA, rowB, columnId, desc),
                        Cell: ({ cell }: any) => {
                            return <>$ {parseNumber( cell.value, 4) }</>
                        }
                    },
                ]
            },
            {
                Header: 'Volume',
                columns: [
                    {
                        Header: 'Base',
                        accessor: 'bought_volume',
                        Cell: ({ cell }: any) => {
                            className: (cell.column as any).className = 'text-right'
                            return <>{cell.value}</>
                        },
                        sortable: false
                    },
                    {
                        Header: 'Pair',
                        accessor: 'bought_amount',
                        className: '',
                        sortable: false
                    },
                ]
            },
            {
                Header: 'Safety Orders',
                columns: [
                    {
                        Header: 'Total/Max',
                        accessor: 'safetyOrderString',
                        className: 'text-center'
                    },
                    {
                        Header: 'Active',
                        accessor: 'current_active_safety_orders',
                        className: 'text-center'
                    }
                ]
            },
            {
                Header: 'Profit',
                columns: [
                    {
                        Header: '$',
                        id: 'actual_usd_profit',
                        accessor: 'actual_usd_profit',
                        className: 'text-center',
                        sortType: (rowA: any, rowB: any, columnId: string, desc: boolean) => sortMe(rowA, rowB, columnId, desc),
                        Cell: ({ cell }: any) => {

                            const in_profit = (cell.row.original.in_profit) ? 'green' : 'red'
                            return <span className={"pill " + in_profit} > $ {parseNumber( cell.value, 2) }</span>
                        }
                    },
                    {
                        Header: '%',
                        accessor: 'actual_profit_percentage',
                        className: 'text-center',
                        sortType: (rowA: any, rowB: any, columnId: string, desc: boolean) => sortMe(rowA, rowB, columnId, desc),
                        Cell: ({ cell }: any) => {
                            const in_profit = (cell.row.original.in_profit) ? 'green' : 'red'
                            return <span className={"pill " + in_profit} >{+cell.value} %</span>
                        }
                    },
                    {
                        Header: 'UR',
                        accessor: 'unrealized_profit',
                        className: 'text-center',
                        sortType: (rowA: any, rowB: any, columnId: string, desc: boolean) => sortMe(rowA, rowB, columnId, desc),
                        Cell: ({ cell }: any) => {
                            return <span >$ {parseNumber( cell.value, 3) }</span>
                        }
                    }
                ]
            },
            {
                Header: 'Max',
                columns: [
                    {
                        Header: 'Funds',
                        accessor: 'max_deal_funds',
                        className: 'text-center',
                    },
                    {
                        Header: 'Deviation',
                        accessor: 'max_deviation',
                        className: 'text-center',
                        Cell: ({ cell }: any) => {
                            return <>{cell.value} % </>
                        }
                    }
                ]

            }


        ],
        []
    )




    return (
        <Styles>
            <CustomTable
                columns={columns}
                data={localData}
                disableMultiSort={true}
                autoResetSortBy={false}
                // autoResetPage={false}
                // manualSortBy={true}
                //@ts-ignore
                getHeaderProps={column => ({
                    // onClick: () => setSort(column.id),
                    style: {
                        height: '44px',
                        backgroundColor: 'var(--color-secondary-light87)'
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

                    // style: {
                    //     color: (cellInfo.column.id === 'actual_usd_profit' || cellInfo.column.id === 'actual_profit_percentage') ? (cellInfo.row.original.in_profit) ? 'var(--color-green)' : 'var(--color-red)': null,
                    //     fontWeight: (cellInfo.column.id === 'actual_usd_profit' || cellInfo.column.id === 'actual_profit_percentage') ? '700' : null
                    // }

                })}
            />
        </Styles>
    )
}

export default DealsTable
