import React, { useEffect } from 'react';

import {
  useTable, useSortBy, useExpanded, useFlexLayout,
} from 'react-table';
import TableHeader from './TableParts/HeaderGroup';
import TableBody from './TableParts/Body';
import './Table.scss';

import { initialSortBy, setSortStorage } from './utils';
import { TableType } from './types';

const blankCustomProps = { style: {}, className: '', role: undefined };
const tableState: TableType = {
  customHeaderProps: blankCustomProps,
  customColumnProps: blankCustomProps,
  customRowProps: blankCustomProps,
  customCellProps: blankCustomProps,
  data: [],
  columns: [],
  renderRowSubComponent: undefined,
  localStorageSortName: undefined,
  handleEditCellChangeCommitted: undefined,
};

// Expose some prop getters for headers, rows and cells, or more if you want!
const CustomTable: React.FC<typeof tableState> = ({
  columns, data,
  renderRowSubComponent = undefined,
  handleEditCellChangeCommitted, localStorageSortName,
  customHeaderProps = blankCustomProps,
  customColumnProps = blankCustomProps,
  customRowProps = blankCustomProps,
  customCellProps = blankCustomProps,
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 100, // width is used for both the flex-basis and flex-grow
    }),
    [],
  );

  const {
    getTableProps, getTableBodyProps, headerGroups, rows,
    prepareRow,
    visibleColumns,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
      autoResetSortBy: false,
      handleEditCellChangeCommitted,
      autoResetExpanded: false,
      initialState: {
        sortBy: initialSortBy(localStorageSortName),
      },
      defaultColumn,
    },
    useSortBy,
    useExpanded,
    useFlexLayout,
  );

  useEffect(() => {
    if (sortBy !== undefined) setSortStorage(sortBy, localStorageSortName);
  }, [sortBy]);

  const tableProps = getTableProps();

  return (
    <div
      style={tableProps.style}
      className={`dealsTable table ${tableProps.className}`}
      role={tableProps.role}
    >
      <TableHeader
        headerGroups={headerGroups}
        customColumnProps={customColumnProps}
        customHeaderProps={customHeaderProps}
        key="table-header"
      />
      <TableBody
        bodyProps={getTableBodyProps()}
        customCellProps={customCellProps}
        customRowProps={customRowProps}
        prepareRow={prepareRow}
        visibleColumns={visibleColumns}
        renderRowSubComponent={renderRowSubComponent || undefined}
        rows={rows}
        key="table-body"
      />

    </div>
  );
};

export default CustomTable;
