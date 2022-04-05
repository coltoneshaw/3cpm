import React, { useEffect, useState } from 'react';

import { CustomTable } from 'webapp/Components/DataTable/Index';
import { getDateString } from 'common/utils/helperFunctions';
import { storageItem } from 'webapp/Features/LocalStorage/LocalStorage';
import { useAppSelector } from 'webapp/redux/hooks';
import EditDeal from 'webapp/Pages/ActiveDeals/Components/EditDeal';
import { numberCell, formattedHeader } from 'webapp/Components/DataTable/Components/columns';
import type { ActiveDeals } from 'types/DatabaseQueries';
import SubRowAsync from './Subrow';

import {
  IdCell, IdHeader, openIn3c,
  tablePill,
  editCell,
} from './columns';
import { TableRow, TableColumn, TableCell } from './dealstableTypes';
import { returnErrorTooltip, sortMe } from './utiils';

const DealsTable = ({ data, selectedColumns }: { data: ActiveDeals[] | [], selectedColumns: string[] }) => {
  const { writeEnabled } = useAppSelector((state) => state.config.currentProfile);
  const localStorageSortName = storageItem.tables.DealsTable.sort;
  const [localData, updateLocalData] = useState<ActiveDeals[]>([]);

  useEffect(() => {
    updateLocalData(data);
  }, [data]);

  const cols: any[] = [
    {
      accessor: 'id',
      Header: ({ toggleAllRowsExpanded }: TableColumn) => IdHeader(toggleAllRowsExpanded),
      Cell: ({ row }: TableCell) => IdCell(row),
      disableSortBy: true,
      width: 30,
      maxWidth: 30,
    },
    {
      Header: () => formattedHeader('Bot Name'),
      accessor: 'bot_name',
      align: 'flex-start',
      width: 150,
      Cell: ({ cell }: TableCell) => openIn3c(cell),
    },
    {
      Header: () => formattedHeader('Pair'),
      accessor: 'pair',
      align: 'flex-start',
      width: 100,
      maxWidth: 100,
    },
    {
      Header: 'Duration',
      id: 'created_at',
      accessor: 'created_at',
      width: 120,
      maxWidth: 120,
      align: 'flex-end',
      Cell: ({ cell }: TableCell) => numberCell(getDateString(cell.value)),
    },
    {
      Header: 'Average Price',
      accessor: 'bought_average_price',
      align: 'flex-end',
      maxWidth: 120,
      sortType: (rowA: TableRow, rowB: TableRow, columnId: keyof TableRow['original']) => sortMe(rowA, rowB, columnId),
      Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
    },
    {
      Header: 'Current',
      accessor: 'current_price',
      align: 'flex-end',
      maxWidth: 120,
      sortType: (rowA: TableRow, rowB: TableRow, columnId: keyof TableRow['original']) => sortMe(rowA, rowB, columnId),
      Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
    },
    {
      Header: 'TP',
      accessor: 'take_profit_price',
      align: 'flex-end',
      maxWidth: 120,
      sortType: (rowA: TableRow, rowB: TableRow, columnId: keyof TableRow['original']) => sortMe(rowA, rowB, columnId),
      Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
    },
    {
      Header: 'Quote',
      accessor: 'bought_volume',
      align: 'flex-end',
      maxWidth: 120,
      Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
    },
    {
      Header: 'Base',
      accessor: 'bought_amount',
      align: 'flex-end',
      maxWidth: 120,
      Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
    },
    {
      Header: 'Active SO',
      accessor: 'current_active_safety_orders',
      maxWidth: 80,
      Cell: ({ cell }: TableCell) => {
        if (Number(cell.row.original.deal_has_error) === 1) {
          return returnErrorTooltip(cell.row.original.error_message, cell.value);
        }
        return numberCell(cell.value);
      },
    },
    {
      Header: '# SO',
      accessor: 'safetyOrderString',
      minWidth: 100,
      maxWidth: 120,
      Cell: ({ cell }: TableCell) => {
        if (Number(cell.row.original.deal_has_error) === 1) {
          return returnErrorTooltip(cell.row.original.error_message, cell.value);
        }
        return numberCell(cell.value);
      },
    },
    {
      Header: '$ Profit',
      id: 'actual_usd_profit',
      accessor: 'actual_usd_profit',
      className: 'text-center',
      width: 100,
      maxWidth: 200,
      sortType: (rowA: TableRow, rowB: TableRow, columnId: keyof TableRow['original']) => sortMe(rowA, rowB, columnId),
      Cell: ({ cell }: TableCell) => tablePill(cell, 'pill-left'),
    },
    {
      Header: '% Profit',
      accessor: 'actual_profit_percentage',
      className: 'text-center',
      width: 100,
      maxWidth: 120,
      sortType: (rowA: TableRow, rowB: TableRow, columnId: keyof TableRow['original']) => sortMe(rowA, rowB, columnId),
      Cell: ({ cell }: TableCell) => tablePill(cell, 'pill-right'),
    },
    {
      Header: 'Unrealized',
      accessor: 'unrealized_profit',
      align: 'flex-end',
      maxWidth: 120,
      sortType: (rowA: TableRow, rowB: TableRow, columnId: keyof TableRow['original']) => sortMe(rowA, rowB, columnId),
      Cell: ({ cell }: TableCell) => numberCell(
        cell.value,
        true,
        cell.row.original.from_currency,
        { paddingLeft: '1em' },
      ),
    },
    {
      Header: 'Funds',
      accessor: 'max_deal_funds',
      align: 'flex-end',
      maxWidth: 120,
      Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
    },
    {
      Header: 'Deviation',
      accessor: 'max_deviation',
      align: 'flex-end',
      maxWidth: 120,
      style: { paddingRight: '1rem' },
      Cell: ({ cell }: TableCell) => numberCell(`${cell.value.toFixed(2)}%`),
    },
  ];

  const columns = React.useMemo(() => cols, []);

  // Create a function that will render our row sub components
  const renderRowSubComponent = React.useCallback(
    ({ row, visibleColumns }) => (
      <SubRowAsync
        row={row}
        visibleColumns={visibleColumns}
      />
    ),
    [],
  );

  const [openEditDialog, changeOpenEditDialog] = useState<boolean>(false);
  const [editRow, changeEditRow] = useState({});
  function handleDialogClose() {
    changeOpenEditDialog(false);
  }

  function edit({ row }: any) {
    changeEditRow({ ...row.original });
    changeOpenEditDialog(true);
  }
  // TODO
  // This can be rewritten to utilize the hide property of react-table
  if (writeEnabled) {
    cols.push({
      Header: '',
      id: 'actions',
      style: { textAlign: 'right', paddingRight: '1rem' },
      Cell: ({ row }: TableCell) => editCell(row, edit),
    });
  }

  return (
    <>

      <EditDeal
        originalDeal={editRow}
        open={openEditDialog}
        onClose={() => handleDialogClose}
      />

      <div className="activeDealsTable dataTableBase">
        <CustomTable
          columns={columns.filter((c) => selectedColumns.includes(c.accessor))}
          data={localData}
          renderRowSubComponent={renderRowSubComponent}
          autoResetSortBy={false}
          autoResetPage={false}
          localStorageSortName={localStorageSortName}
          customHeaderProps={{
            style: {
              height: '44px',
              backgroundColor: 'var(--color-secondary-light87)',
              zIndex: 1000,
            },
          }}
          customColumnProps={{}}
          customRowProps={{}}
          customCellProps={{}}
        />
      </div>
    </>
  );
};

export default DealsTable;
