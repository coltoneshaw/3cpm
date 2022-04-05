import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { OpenIn3Commas } from 'webapp/Components/DataTable/Components';
import { formatCurrency } from 'common/utils/granularity';
import { parseNumber } from 'common/utils/numberFormatting';
import { TableRow, Cell } from './dealstableTypes';

export const IdHeader = (toggleAllRowsExpanded: (value: boolean | undefined) => void) => (
  <span
    onClick={() => toggleAllRowsExpanded(false)}
    style={{ cursor: 'pointer' }}
    role="button"
    tabIndex={0}
    onKeyPress={() => toggleAllRowsExpanded(false)}
  >
    X
  </span>
);

export const IdCell = (row: TableRow) => {
  const { isExpanded, getToggleRowExpandedProps } = row;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <span {...getToggleRowExpandedProps()}>
      {isExpanded ? '🔽' : '▶️'}
    </span>
  );
};

export const openIn3c = (cell: Cell) => (
  <OpenIn3Commas
    cell={cell}
    bot_id={cell.row.original.bot_id}
    className="tooltip-activeDeals"
  />
);

export const tablePill = (cell: Cell, direction: 'pill-left' | 'pill-right') => {
  const inProfit = (cell.row.original.actual_profit_percentage > 0) ? 'green' : 'red';

  let value;
  if (cell.column.id === 'actual_usd_profit') value = formatCurrency(['USD'], cell.value, false).metric;
  if (cell.column.id === 'actual_profit_percentage') value = parseNumber(cell.value, 2);
  return (
    <span
      className={`pill ${direction} monospace-cell ${inProfit}`}
    >
      {value}
    </span>
  );
};

export const editCell = (row: TableRow, edit: CallableFunction) => (
  <IconButton color="info" size="small" onClick={() => { edit(row); }}><EditIcon /></IconButton>

);
