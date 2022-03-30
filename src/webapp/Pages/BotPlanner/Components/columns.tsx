import { Switch, Checkbox } from '@mui/material';
import React from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Cell } from './tableTypes';
import { OpenIn3Commas } from '@/webapp/Components/DataTable/Components';

export const isEnabledSwitch = (cell: Cell, handleOnOff: (e: any) => void) => (
  <Switch
    checked={cell.value === 1 || cell.value === true}
    color="primary"
    onClick={handleOnOff}
    name={String(cell.row.original.id) || undefined}
    inputProps={{ 'aria-label': 'secondary checkbox' }}
  />
);

export const hideCheckbox = (
  cell: Cell,
  handleEditCellChangeCommitted: (id: number, column: string, value: string | boolean) => void,
) => (
  <Checkbox
    checked={cell.value === 1 || cell.value === true}
    onChange={() => handleEditCellChangeCommitted(Number(cell.row.original.id), 'hide', !cell.value)}
    name="summary"
    style={{ color: 'var(--color-secondary)' }}
  />
);

export const openIn3c = (cell: Cell) => (
  <OpenIn3Commas
    cell={cell}
    bot_id={cell.row.original.id}
    className="tooltip-activeDeals"
  />
);

export const deleteIcon = (
  type: 'header' | 'cell',
  cell?: Cell,
  handleDeleteRow?: (cellId: number | string) => void,
) => {
  if (type === 'header') return <DeleteIcon />;
  if (cell && handleDeleteRow && cell.value === 'custom') {
    return <DeleteIcon onClick={() => handleDeleteRow(Number(cell.row.original.id))} />;
  }
  return null;
};
