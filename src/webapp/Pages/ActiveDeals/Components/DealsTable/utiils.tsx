import React from 'react';
import CardTooltip from '@/webapp/Components/Charts/DataCards/CustomToolTip';
import { TableRow } from './dealstableTypes';

export const returnErrorTooltip = (errorMessage: string, value: string) => (
  <CardTooltip title={(
    <>
      <strong>Error: </strong>
      {errorMessage}
    </>
  )}
  >
    <span
      className=" monospace-cell"
      style={{
        color: 'var(--color-red)',
        fontWeight: 700,
      }}
    >
      {value}
    </span>
  </CardTooltip>
);

export const sortMe = (
  rowA: TableRow,
  rowB: TableRow,
  columnId: keyof TableRow['original'],
) => {
  const first = rowA.original[columnId];
  const second = rowB.original[columnId];
  return ((first && second && first > second) ? -1 : 1);
};
