import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { TableRow, Cell } from './dealstableTypes';
import { OpenIn3Commas } from '@/app/Components/DataTable/Components';
import { formatCurrency } from '@/utils/granularity';
import { parseNumber } from '@/utils/numberFormatting';

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

export const formattedHeader = (text: string) => (
  <span style={{ width: '100%', textAlign: 'left', paddingLeft: '3px' }}>{text}</span>
);

export const openIn3c = (cell: Cell) => {
  console.log(cell);
  return (
    <OpenIn3Commas cell={cell} bot_id={cell.row.original.bot_id} className="tooltip-activeDeals" />
  );
};

export const numberCell = (value: any, format?: boolean, cell?: Cell, style?: React.CSSProperties) => {
  let valueIs = value;
  if (format && cell) {
    valueIs = formatCurrency([cell.row.original.from_currency], cell.value, true).metric;
  }
  return (
    <span
      className=" monospace-cell"
      style={style}
    >
      {valueIs}
    </span>
  );
};

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
