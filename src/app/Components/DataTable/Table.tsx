import React, { useEffect, useCallback } from "react";

import { useTable, useSortBy, useExpanded, useFlexLayout, HeaderGroup, HeaderProps } from 'react-table'
import { setStorageItem, getStorageItem } from '@/app/Features/LocalStorage/LocalStorage';
import { FixedSizeList } from 'react-window'

import './Table.scss'
const defaultPropGetter = ({ }: any) => ({})


const initialSortBy = (localStorageSortName: string) => {
    const getSortFromStorage = getStorageItem(localStorageSortName);
    return (getSortFromStorage != undefined) ? getSortFromStorage : [];
}

//@ts-ignore
const headerProps = (props, { column }) => getStyles(props, column.align, column.maxWidth)
//@ts-ignore
const cellProps = (props, { cell }) => getStyles(props, cell.column.align, cell.column.maxWidth)
//@ts-ignore
const getStyles = (props, align = 'center', maxWidth) => [
    props,
    {
        style: {
            ...props.style,
            maxWidth: (maxWidth) ? maxWidth + 'px' : null,
            justifyContent: align,
            alignItems: 'center',
            display: 'flex',
            // flexDirection: (type === 'cell') ? 'column' : 'row'
        },
    },
]

const scrollbarWidth = () => {
    // thanks too https://davidwalsh.name/detect-scrollbar-width
    const scrollDiv = document.createElement('div')
    scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;')
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
}


// Expose some prop getters for headers, rows and cells, or more if you want!
const CustomTable = ({
    // @ts-ignore
    columns, data,
    // @ts-ignore
    renderRowSubComponent,
    getHeaderProps = defaultPropGetter, getColumnProps = defaultPropGetter,
    // @ts-ignore
    getRowProps = defaultPropGetter, getCellProps = cellProps,
    // @ts-ignore
    updateLocalBotData, updateReservedFunds, localStorageSortName, }) => {

    const defaultColumn = React.useMemo(
        () => ({
            // When using the useFlexLayout:
            minWidth: 30, // minWidth is only used as a limit for resizing
            width: 100, // width is used for both the flex-basis and flex-grow
        }),
        []
    )

    const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])


    //@ts-ignore
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns, totalColumnsWidth, state: { sortBy } } = useTable(
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

    const RenderRow = useCallback(({ index, style }) => {
        const row = rows[index]
        prepareRow(row)
        const rowProps = row.getRowProps(getRowProps(row));
        return (
            <>
                <div {...rowProps} className="tr" key={row.id}>
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
    }, [prepareRow, rows])




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
                    <div {...headerGroup.getHeaderGroupProps()} className="tr" key={headerGroup.id}>
                        {headerGroup.headers.map((column) => (

                            <div  // Return an array of prop objects and react-table will merge them appropriately
                                {...column.getHeaderProps([
                                    {
                                        //@ts-ignore
                                        className: column.className,
                                        style: {
                                            //@ts-ignore
                                            ...column.style,
                                            maxWidth: (column.maxWidth) ? column.maxWidth : null,
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
                <FixedSizeList
                    height={600}
                    itemCount={rows.length}
                    itemSize={35}
                    width={totalColumnsWidth + scrollBarSize}
                >
                    {RenderRow}
                </FixedSizeList>
            </div>
        </div>
    )
}

export default CustomTable