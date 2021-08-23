// import { dynamicSort } from "@/utils/helperFunctions";
import React, { useState, useEffect } from "react";
// import formatDeal from './FormatDeals';

import { useTable, useSortBy } from 'react-table'


const defaultPropGetter = () => ({})

// Expose some prop getters for headers, rows and cells, or more if you want!
// @ts-ignore
function CustomTable({
    // @ts-ignore
    columns,
    // @ts-ignore
    data,
    getHeaderProps = defaultPropGetter,
    getColumnProps = defaultPropGetter,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,

    //@ts-ignore
    updateLocalBotData,
    // skipPageReset
}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            //@ts-ignore
            autoResetSortBy: false,
            // defaultColumn,
            // use the skipPageReset option to disable page resetting temporarily
            // autoResetPage: !skipPageReset,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateLocalBotData,

        },
        useSortBy
    )


    return (
        <table {...getTableProps()} className="dealsTable">
            <thead style={{ textAlign: 'center' }}>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                // Return an array of prop objects and react-table will merge them appropriately
                                {...column.getHeaderProps([
                                    {
                                        //@ts-ignore
                                        className: column.className,
                                        //@ts-ignore
                                        style: column.style,
                                    },

                                    //@ts-ignore
                                    getColumnProps(column),
                                    //@ts-ignore
                                    getHeaderProps(column),

                                    // this automatically sorts the data by what's in the columns
                                    //@ts-ignore
                                    column.getSortByToggleProps()
                                ])}
                            >
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span>
                                    {//@ts-ignore
                                        column.isSorted
                                            //@ts-ignore
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        // Merge user row props in
                        //@ts-ignore
                        <tr {...row.getRowProps(getRowProps(row))}>
                            {row.cells.map(cell => {
                                return (
                                    <td
                                        // Return an array of prop objects and react-table will merge them appropriately
                                        {...cell.getCellProps([
                                            {
                                                //@ts-ignore
                                                className: cell.column.className,
                                                //@ts-ignore
                                                style: cell.column.style,
                                            },
                                            //@ts-ignore
                                            getColumnProps(cell.column),
                                            //@ts-ignore
                                            getCellProps(cell),
                                        ])}
                                    >
                                        {cell.render('Cell')}

                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default CustomTable