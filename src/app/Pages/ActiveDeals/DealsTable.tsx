import React, { useEffect, useState } from 'react'
import { formatCurrency } from '@/utils/granularity'


import { CustomTable } from '@/app/Components/DataTable/Index'
import { getDateString } from '@/utils/helperFunctions';
import { parseNumber } from '@/utils/number_formatting';
import { storageItem } from '@/app/Features/LocalStorage/LocalStorage';
import CardTooltip from '@/app/Components/Charts/DataCards/CustomToolTip';
import { SubRowAsync } from './Components/index'
import EditIcon from '@mui/icons-material/Edit';

import { OpenIn3Commas } from '@/app/Components/DataTable/Components'

import Styles from './StyledDiv'
import { useAppSelector } from "@/app/redux/hooks";
import IconButton from "@mui/material/IconButton";
import EditDeal from "@/app/Pages/ActiveDeals/Components/EditDeal";

const returnErrorTooltip = (errorMessage: string, value: string) => {

    return (
        <CardTooltip title={<> <strong>Error: </strong>{errorMessage} </>} >
            < span className=" monospace-cell" style={{ color: 'var(--color-red)', fontWeight: 700 }}>{value}</span>
        </CardTooltip>
    )
}


function DealsTable({ data }: { data: object[] }) {

    const { writeEnabled } = useAppSelector(state => state.config.currentProfile);

    const localStorageSortName = storageItem.tables.DealsTable.sort;

    const [localData, updateLocalData] = useState<object[]>([]);

    useEffect(() => {
        updateLocalData(data)
    }, [data])

    const sortMe = (rowA: any, rowB: any, columnId: string) => {
        return (rowA.original[columnId] > rowB.original[columnId]) ? -1 : 1
    }

    let cols: any[] = [
        {
            accessor: 'id',
            Header: ({ toggleAllRowsExpanded, rows }: { toggleAllRowsExpanded: any, rows: any[] }) => {
                return (
                    <span onClick={() => toggleAllRowsExpanded(false)} style={{ cursor: 'pointer' }}>
                        X
                    </span>
                )
            },
            Cell: ({ row }: any) => (
                <span {...row.getToggleRowExpandedProps()}>
                    {row.isExpanded ? '🔽' : '▶️'}
                </span>
            ),
            disableSortBy: true
        },
        {
            Header: 'Bot Name',
            accessor: 'bot_name', // accessor is the "key" in the data,
            style: {
                textAlign: 'left',
                paddingLeft: '1em',
                width: '150px'
            },

            Cell: ({ cell }: any) => <OpenIn3Commas cell={cell} bot_id={cell.row.original.bot_id} className='tooltip-activeDeals' />
        },
        {
            Header: 'Pair',
            accessor: 'pair',
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

            style: { textAlign: 'left', width: '120px' },
        },
        {
            Header: 'Duration',
            id: 'created_at',
            accessor: 'created_at',
            style: {
                textAlign: 'right'
            },
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell">{getDateString(cell.value)}</span>
            }
        },
        {
            Header: 'Current',
            accessor: 'current_price',
            style: { textAlign: 'right' },
            sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell">{formatCurrency([cell.row.original.from_currency], cell.value, true).metric}</span>
            }
        },
        {
            Header: 'TP',
            accessor: 'take_profit_price',
            style: { textAlign: 'right' },
            sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell">{formatCurrency([cell.row.original.from_currency], cell.value, true).metric}</span>
            }
        },
        {
            Header: 'Quote',
            accessor: 'bought_volume',
            style: { textAlign: 'right' },
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell">{formatCurrency([cell.row.original.from_currency], cell.value, false).metric}</span>
            }
        },
        {
            Header: 'Base',
            accessor: 'bought_amount',
            style: { textAlign: 'right' },
            className: '',
            sortable: false,
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell">{formatCurrency([cell.row.original.from_currency], cell.value, false).metric}</span>
            },
        },
        {
            Header: 'Active SO',
            accessor: 'current_active_safety_orders',
            style: {
                textAlign: 'center',
            },
            Cell: ({ cell }: any) => {
                if (cell.row.original.deal_has_error == 1) return returnErrorTooltip(cell.row.original.error_message, cell.value);
                return < span className=" monospace-cell">{cell.value}</span>
            },
        },
        {
            Header: '# SO',
            accessor: 'safetyOrderString',
            style: {
                textAlign: 'center'
            },
            Cell: ({ cell }: any) => {
                if (cell.row.original.deal_has_error == 1) return returnErrorTooltip(cell.row.original.error_message, cell.value);
                return < span className=" monospace-cell">{cell.value}</span>
            },
        },

        {
            Header: '$ Profit',
            id: 'actual_usd_profit',
            accessor: 'actual_usd_profit',
            className: 'text-center',
            sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
            Cell: ({ cell }: any) => {

                const in_profit = (cell.row.original.actual_profit_percentage > 0) ? 'green' : 'red'
                // leaving this as USD for now because 3C only displays this value in a USD quote.
                return < span className={"pill pill-left monospace-cell " + in_profit} >{formatCurrency(['USD'], cell.value, false).metric}</span>
            },
            style: {
                paddingRight: 0,
                maxWidth: '6em'
            }
        },
        {
            Header: '% Profit',
            accessor: 'actual_profit_percentage',
            className: 'text-center',
            sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
            Cell: ({ cell }: any) => {
                const in_profit = (cell.row.original.actual_profit_percentage > 0) ? 'green' : 'red'
                return <span className={"pill pill-right monospace-cell " + in_profit}>{parseNumber(cell.value, 2)} %</span>
            },
            style: {
                paddingLeft: 0,
                maxWidth: '6em'
            }
        },
        {
            Header: 'Unrealized',
            accessor: 'unrealized_profit',
            style: { textAlign: 'right' },
            sortType: (rowA: any, rowB: any, columnId: string) => sortMe(rowA, rowB, columnId),
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell" style={{ paddingLeft: '1em' }}>{formatCurrency([cell.row.original.from_currency], cell.value, false).metric}</span>
            }
        },
        {
            Header: 'Funds',
            accessor: 'max_deal_funds',
            style: { textAlign: 'right' },
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell">{formatCurrency([cell.row.original.from_currency], cell.value, true).metric}</span>
            },
        },
        {
            Header: 'Deviation',
            accessor: 'max_deviation',
            style: { textAlign: 'right', paddingRight: '1rem' },
            Cell: ({ cell }: any) => {
                return < span className=" monospace-cell">{cell.value}%</span>
            },
        }
    ]


    // TODO
    // This can be rewritten to utilize the hide property of react-table
    if (writeEnabled) {
        cols.push({
            Header: '',
            id: 'actions',
            style: { textAlign: 'right', paddingRight: '1rem' },
            Cell: (row: any) => {
                return (
                    <>
                        <IconButton color="info" size="small" onClick={() => { edit(row) }}><EditIcon /></IconButton>
                    </>
                )
            },
        })
    }

    const columns = React.useMemo(
        () => cols, [])


    // Create a function that will render our row sub components
    const renderRowSubComponent = React.useCallback(
        ({ row, visibleColumns }) => (
            <SubRowAsync
                row={row}
                visibleColumns={visibleColumns}
            />
        ),
        []
    );



    function edit({ row }: any) {
        changeEditRow({ ...row.original })
        changeOpenEditDialog(true)
    }

    const [openEditDialog, changeOpenEditDialog] = useState<boolean>(false);
    const [editRow, changeEditRow] = useState({});
    function handleDialogClose() {
        console.log(arguments)
        changeOpenEditDialog(false)

    }

    return (
        <>

            <EditDeal originalDeal={editRow} open={openEditDialog} onClose={handleDialogClose}></EditDeal>

            <Styles>
                <CustomTable
                    columns={columns}
                    data={localData}
                    renderRowSubComponent={renderRowSubComponent}
                    autoResetSortBy={false}
                    autoResetPage={false}
                    localStorageSortName={localStorageSortName}
                    //@ts-ignore
                    getHeaderProps={() => ({
                        // onClick: () => setSort(column.id),
                        style: {
                            height: '44px',
                            backgroundColor: 'var(--color-secondary-light87)',
                            zIndex: '1000'
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
        </>
    )
}

export default DealsTable
