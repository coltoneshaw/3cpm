import React, { useEffect, useState } from 'react'
import { CustomTable } from '@/app/Components/DataTable/Index'
import { getDateString } from '@/utils/helperFunctions';
import { parseNumber } from '@/utils/number_formatting';
import {  storageItem } from '@/app/Features/LocalStorage/LocalStorage';


import Styles from './StyledDiv'



function DealsTable({ data }: { data: object[] }) {
    const localStorageSortName = storageItem.tables.DealsTable.sort;

    const [localData, updateLocalData] = useState<object[]>([])


    useEffect(() => {
        updateLocalData(data)
    }, [data])

    const sortMe = (rowA: any, rowB: any, columnId: string) => {
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
                        style: {
                            textAlign: 'left',
                            paddingLeft: '1em',
                            width: '150px'
                        },

                        Cell: ({ cell }: any) => {
                            return (
                                <span
                                    data-text={cell.row.original.bot_settings}
                                    className="tooltip-activeDeals">
                                    {cell.value}
                                </span>
                            )
                        }
                    },
                    {
                        Header: 'Pair',
                        accessor: 'pair',

                        style: {textAlign: 'left', width: '120px'},
                    },
                    {
                        Header: 'Duration',
                        id: 'created_at',
                        accessor: 'created_at',
                        style: {
                            textAlign: 'left'
                        },
                        Cell: ({ cell }: any) => {
                            return  < span className=" monospace-cell">{getDateString(cell.value)}</span>
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
                        style: {textAlign: 'left'},
                        sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
                        Cell: ({ cell }: any) => {
                            return < span className=" monospace-cell">$ {parseNumber( cell.value, 4) }</span>
                        }
                    },
                    {
                        Header: 'TP',
                        accessor: 'take_profit_price',
                        style: {textAlign: 'left'},
                        sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
                        Cell: ({ cell }: any) => {
                            return < span className=" monospace-cell">$ {parseNumber( cell.value, 4) }</span>
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
                        style: {textAlign: 'left'},
                        Cell: ({ cell }: any) => {
                            return  < span className=" monospace-cell">{cell.value}</span>
                        },
                        sortable: false
                    },
                    {
                        Header: 'Pair',
                        accessor: 'bought_amount',
                        style: {textAlign: 'left'},
                        className: '',
                        sortable: false,
                        Cell: ({ cell }: any) => {
                            return  < span className=" monospace-cell">{cell.value}</span>
                        },
                    },
                ]
            },
            {
                Header: 'Safety Orders',
                columns: [
                    {
                        Header: 'Total/Max',
                        accessor: 'safetyOrderString',
                        style: {textAlign: 'center'},
                    },
                    {
                        Header: 'Active',
                        accessor: 'current_active_safety_orders',
                        style: {textAlign: 'center'},
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
                        sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
                        Cell: ({ cell }: any) => {

                            const in_profit = (cell.row.original.actual_profit_percentage > 0) ? 'green' : 'red'
                            return <span className={"pill pill-left monospace-cell " + in_profit} > $ {parseNumber( cell.value, 2) }</span>
                        },
                        style: {
                            paddingRight: 0,
                            maxWidth: '6em'
                        }
                    },
                    {
                        Header: '%',
                        accessor: 'actual_profit_percentage',
                        className: 'text-center',
                        sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
                        Cell: ({ cell }: any) => {
                            const in_profit = (cell.row.original.actual_profit_percentage> 0) ? 'green' : 'red'
                            return <span className={"pill pill-right monospace-cell " +  in_profit }>{parseNumber( cell.value, 2) } %</span>
                        },
                        style: {
                            paddingLeft: 0,
                            maxWidth: '6em'
                        }
                    },
                    {
                        Header: 'Unrealized',
                        accessor: 'unrealized_profit',
                        style: {textAlign: 'left'},
                        sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
                        Cell: ({ cell }: any) => {
                            return <span className=" monospace-cell" style={{paddingLeft: '1em'}}>$ {parseNumber( cell.value, 3) }</span>
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
                        style: {textAlign: 'left'},
                        Cell: ({ cell }: any) => {
                            return  < span className=" monospace-cell">{cell.value}</span>
                        },
                    },
                    {
                        Header: 'Deviation',
                        accessor: 'max_deviation',
                        style: {textAlign: 'left'},
                        Cell: ({ cell }: any) => {
                            return  < span  className=" monospace-cell">{cell.value}%</span>
                        },
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
                autoResetSortBy={false}
                autoResetPage={false}
                localStorageSortName={localStorageSortName}
                //@ts-ignore
                getHeaderProps={() => ({
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
