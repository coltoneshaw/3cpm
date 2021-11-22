// import { dynamicSort } from "@/utils/helperFunctions";
import React, { useEffect } from "react";
// import formatDeal from './FormatDeals';

import { useTable, useSortBy, useExpanded, useFlexLayout, HeaderGroup, HeaderProps } from 'react-table'
import { setStorageItem, getStorageItem } from '@/app/Features/LocalStorage/LocalStorage';

// const initialSortBy = [{ id: "created_at", desc: false }]
const defaultPropGetter = () => ({})


const initialSortBy = (localStorageSortName: string) => {
    const getSortFromStorage = getStorageItem(localStorageSortName);
    return (getSortFromStorage != undefined) ? getSortFromStorage : [];
}

//@ts-ignore
const headerProps = (props, { column }) => getStyles(props, column.align, 'header')
//@ts-ignore
const cellProps = (props, { cell }) => getStyles(props, cell.column.align, 'cell')
//@ts-ignore
const getStyles = (props, align = 'center', type = 'cell') => [
    props,
    {
        style: {
            ...props.style,
            justifyContent: align,
            alignItems: 'center',
            display: 'flex',
            // flexDirection: (type === 'cell') ? 'column' : 'row'
        },
    },
]


// Expose some prop getters for headers, rows and cells, or more if you want!
// @ts-ignore
function CustomTable({ columns, data, renderRowSubComponent, getHeaderProps = defaultPropGetter, getColumnProps = defaultPropGetter, getRowProps = defaultPropGetter, getCellProps = cellProps, updateLocalBotData, updateReservedFunds, localStorageSortName, }) {

    const defaultColumn = React.useMemo(
        () => ({
            // When using the useFlexLayout:
            minWidth: 30, // minWidth is only used as a limit for resizing
            width: 100, // width is used for both the flex-basis and flex-grow
        }),
        []
    )


    //@ts-ignore
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns, state: { sortBy } } = useTable(
        {
            columns, data,
            //@ts-ignore
            autoResetSortBy: false,
            updateLocalBotData,
            updateReservedFunds,
            autoResetExpanded: false,
            //@ts-ignore
            initialState: { sortBy: initialSortBy(localStorageSortName) },
            defaultColumn,
        },
        useSortBy,
        useExpanded,
        useFlexLayout
    );




    useEffect(() => {
        if (sortBy != undefined) setSortStorage(sortBy)
    }, [sortBy]);


    const setSortStorage = (sort: object[]) => {
        setStorageItem(localStorageSortName, sort)
    }


    return (
        <div {...getTableProps()} className="dealsTable table">
            <div style={{ textAlign: 'center' }} className="thead">
                {headerGroups.map(headerGroup => (
                    <div {...headerGroup.getHeaderGroupProps()} className="tr">
                        {headerGroup.headers.map((column) => (

                            <div  // Return an array of prop objects and react-table will merge them appropriately
                                {...column.getHeaderProps([
                                    {
                                        //@ts-ignore
                                        className: column.className,
                                        style: {
                                            //@ts-ignore
                                            ...column.style,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            textAlign: 'center !important',
                                            padding: '5px 0',
                                            height: '44px',
                                        },
                                    },

                                    //@ts-ignore
                                    getColumnProps(column),
                                    //@ts-ignore
                                    getHeaderProps(column),

                                    // this automatically sorts the data by what's in the columns
                                    //@ts-ignore
                                    column.getSortByToggleProps()
                                ])}
                                className="th"
                            >
                                {column.render('Header')}
                                {/* @ts-ignore */}
                                {column.canSort && (
                                    <span style={{ paddingLeft: '.5em' }}>
                                        {//@ts-ignore
                                            column.isSorted ? column.isSortedDesc ? ' 🔽' : ' 🔼' : ''}
                                    </span>
                                )}

                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div {...getTableBodyProps()} className="tbody">
                {rows.map((row) => {
                    prepareRow(row)
                    //@ts-ignore
                    const rowProps = row.getRowProps(getRowProps(row));

                    return (
                        <>
                            <div {...rowProps} className="tr">
                                {row.cells.map(cell => {
                                    return (
                                        <div  {...cell.getCellProps(cellProps)} className="td" >
                                            {cell.render('Cell')}

                                        </div>
                                    )
                                })}
                            </div>

                            { // @ts-ignore
                                row.isExpanded && renderRowSubComponent({ row, visibleColumns })
                            }
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default CustomTable