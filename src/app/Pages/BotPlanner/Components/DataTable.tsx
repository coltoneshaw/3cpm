/* eslint-disable @typescript-eslint/naming-convention */
import React, { useMemo } from 'react';

import { Column } from 'react-table';
import { numberCell, formattedHeader } from '@/app/Components/DataTable/Components/columns';
import { useAppSelector } from '@/app/redux/hooks';
import { storageItem } from '@/app/Features/LocalStorage/LocalStorage';

import {
  hideCheckbox, isEnabledSwitch, openIn3c, deleteIcon,
} from './columns';

import { parseNumber } from '@/utils/numberFormatting';
import {
  calcDeviation,
  botPerDealMaxFunds,
  calcBotMaxInactiveFunds,
  calcBotMaxFunds,
  calcDropMetrics,
} from '@/utils/formulas';

import { QueryBotsType } from '@/types/3CommasApi';

import { CustomTable, BotsEditableCell } from '@/app/Components/DataTable/Index';
import { TableCell } from './tableTypes';

const EditableCell = BotsEditableCell;

interface DataTableType {
  localBotData: QueryBotsType[]
  updateLocalBotData: React.Dispatch<React.SetStateAction<QueryBotsType[]>>,
  selectedColumns: string[]
}
const DataTable = ({ localBotData, updateLocalBotData, selectedColumns }: DataTableType) => {
  const localStorageSortName = storageItem.tables.BotPlanner.sort;

  const { metricsData: { totalBankroll } } = useAppSelector((state) => state.threeCommas);

  // handling this locally because it does not need to be saved yet.
  const handleOnOff = (e: any) => {
    updateLocalBotData((prevState: QueryBotsType[]) => {
      const newRows = prevState.map((row: QueryBotsType) => {
        if (e !== undefined && e.target !== null) {
          if (e.target.name === row.id) {
            row.is_enabled = (row.is_enabled === 1) ? 0 : 1;
          }
        }
        return row;
      });
      return calcDropMetrics(totalBankroll, newRows);
    });
  };

  const handleDeleteRow = (cellId: number | string) => {
    updateLocalBotData((prevState: QueryBotsType[]) => {
      const newRows = prevState.filter((row) => {
        if (String(cellId) !== String(row.id)) {
          return row;
        }
        return null;
      });
      return calcDropMetrics(totalBankroll, newRows);
    });
  };

  const handleEditCellChangeCommitted = (id: number, column: string, value: string | boolean) => {
    updateLocalBotData((prevState: QueryBotsType[]) => {
      const newRows = prevState.map((row) => {
        if (id === row.id) {
          // @ts-ignore - validate props
          row[column] = value;

          /**
           * TODO
           * - If it's worth it, find out what row was updated and then calculate the below metrics. There may be a few rows that we don't have to recalc metrics for.
           */

          const {
            max_safety_orders, base_order_volume, safety_order_volume,
            martingale_volume_coefficient, martingale_step_coefficient, max_active_deals,
            active_deals_count, safety_order_step_percentage,
          } = row;

          const maxDealFunds = botPerDealMaxFunds(
            Number(max_safety_orders),
            base_order_volume,
            safety_order_volume,
            martingale_volume_coefficient,
          );
          const maxInactiveFunds = calcBotMaxInactiveFunds(+maxDealFunds, +max_active_deals, +active_deals_count);
          row.max_funds = calcBotMaxFunds(+maxDealFunds, +max_active_deals);
          row.max_funds_per_deal = maxDealFunds;
          row.max_inactive_funds = maxInactiveFunds;
          row.price_deviation = calcDeviation(
            +max_safety_orders,
            +safety_order_step_percentage,
            +martingale_step_coefficient,
          );
        }
        return row;
      });

      return calcDropMetrics(totalBankroll, newRows);
    });
  };

  const columns = useMemo<Column[]>(
    () => [
      {
        Header: 'Enabled?',
        accessor: 'is_enabled',
        width: 80,
        Cell: ({ cell }: TableCell) => isEnabledSwitch(cell, handleOnOff),
      },
      {
        Header: 'Hide?',
        accessor: 'hide',
        width: 50,
        Cell: ({ cell }: TableCell) => hideCheckbox(cell, handleEditCellChangeCommitted),
      },
      {
        Header: () => formattedHeader('Bot Name'),
        accessor: 'name',
        width: 160,
        // Cell: EditableCell,
        Cell: ({ cell }: TableCell) => openIn3c(cell),
      },
      {
        Header: () => formattedHeader('Pairs'),
        accessor: 'pairs',
        align: 'flex-start',
        Cell: ({ cell }: TableCell) => ((cell.value.length > 20) ? 'Many' : cell.value),
      },
      {
        Header: 'Currency',
        accessor: 'from_currency',
        width: 60,
      },
      {
        Header: 'BO',
        accessor: 'base_order_volume',
        Cell: EditableCell,
        className: 'monospace-cell',
      },
      {
        Header: 'SO',
        accessor: 'safety_order_volume',
        Cell: EditableCell,
        className: 'monospace-cell',
      },
      {
        Header: 'TP',
        width: 60,
        accessor: 'take_profit',
        Cell: EditableCell,
        className: 'monospace-cell',
      },
      {
        Header: 'MSTC',
        width: 60,
        accessor: 'max_safety_orders',
        Cell: EditableCell,
        className: 'monospace-cell',
      },
      {
        Header: 'SOS',
        width: 60,
        accessor: 'safety_order_step_percentage',
        Cell: EditableCell,
        className: 'monospace-cell',
      },
      {
        Header: 'OS',
        width: 60,
        accessor: 'martingale_volume_coefficient',
        Cell: EditableCell,
        className: 'monospace-cell',
        style: {
          textAlign: 'center',
        },
      },
      {
        Header: 'SS',
        width: 60,
        accessor: 'martingale_step_coefficient',
        Cell: EditableCell,
        className: 'monospace-cell',
      },
      {
        Header: 'Deals',
        width: 60,
        accessor: 'max_active_deals',
        Cell: EditableCell,
        className: 'monospace-cell',
      },
      {
        Header: 'Deviation',
        width: 80,
        accessor: 'price_deviation',
        Cell: ({ cell }: TableCell) => numberCell(`${cell.value}%`),
      },
      {
        Header: 'Deal Funds',
        accessor: 'max_funds_per_deal',
        Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
        align: 'flex-end',
      },
      {
        Header: 'Bot Funds',
        accessor: 'max_funds',
        Cell: ({ cell }: TableCell) => numberCell(cell.value, true, cell.row.original.from_currency),
        align: 'flex-end',
      },
      {
        Header: 'Coverage',
        width: 80,
        accessor: 'maxCoveragePercent',
        Cell: ({ cell }: TableCell) => numberCell(`${cell.value}%`),
      },
      {
        Header: 'Risk %',
        width: 80,
        accessor: 'riskPercent',
        Cell: ({ cell }: TableCell) => numberCell(`${parseNumber(cell.value * 100)}%`),
      },
      {
        Header: 'Max SO Covered',
        width: 80,
        accessor: 'maxSoReached',
        className: 'monospace-cell',
      },
      {
        Header: () => deleteIcon('header'),
        accessor: 'origin',
        width: 60,
        Cell: ({ cell }: TableCell) => deleteIcon('cell', cell, handleDeleteRow),
      },
    ],
    [],
  );

  return (
    <div className="botsTable dataTableBase">
      <CustomTable
        columns={columns.filter((c) => selectedColumns.includes(String(c.accessor)))}
        data={localBotData}
        autoResetSortBy={false}
        manualSortBy
        updateLocalBotData={handleEditCellChangeCommitted}
        localStorageSortName={localStorageSortName}
        customHeaderProps={{
          style: {
            height: '44px',
            backgroundColor: 'var(--color-secondary-light87)',
            zIndex: 1000,
          },
        }}
        getColumnProps={{}}
        getRowProps={{}}
        getCellProps={{}}
      />
    </div>

  );
};

export default DataTable;
