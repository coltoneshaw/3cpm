import React from 'react';
import CardTooltip from '@/app/Components/Charts/DataCards/CustomToolTip';
import { TableRow } from './dealstableTypes';

export const returnErrorTooltip = (errorMessage: string, value: string) => (
  <CardTooltip title={(
    <>
      <strong>Error: </strong>
      {errorMessage}
    </>
  )}
  >
    <span className=" monospace-cell" style={{ color: 'var(--color-red)', fontWeight: 700 }}>{value}</span>
  </CardTooltip>
);

export const sortMe = (
  rowA: TableRow,
  rowB: TableRow,
  columnId: keyof TableRow['original'],
) => ((rowA.original[columnId] > rowB.original[columnId]) ? -1 : 1);
