import React, { Fragment } from 'react';
import {
  Row, TableCommonProps, ColumnInstance,
} from 'react-table';
import classNames from 'classnames';
import { SubRowAsync } from 'webapp/Pages/ActiveDeals/Components';
import RenderCells from './Cell';

const subRowCheck = (
  row: Row<object>,
  visibleColumns: ColumnInstance<object>[],
  renderRowSubComponent: typeof SubRowAsync | undefined,
) => {
  if (!row.isExpanded || !renderRowSubComponent) return;
  renderRowSubComponent({ row, visibleColumns });
};

const RenderRows = (
  rows: Row<object>[],
  customCellProps: undefined | TableCommonProps,
  customRowProps: undefined | TableCommonProps,
  prepareRow: (row: Row<object>) => void,
  visibleColumns: ColumnInstance<object>[],
  renderRowSubComponent?: typeof SubRowAsync | undefined,
) => {
  if (!rows) return null;
  const mappedRows = rows;

  return mappedRows.map((row) => {
    prepareRow(row);
    const { style, className, key } = row.getRowProps();
    return (
      <Fragment key={key}>
        <div
          style={{
            ...style,
            ...customRowProps?.style,
          }}
          className={classNames('tr', className, customRowProps?.className)}
          key={key}
          role="row"
        >
          {RenderCells(row?.cells, customCellProps)}
        </div>
        {subRowCheck(row, visibleColumns, renderRowSubComponent)}
      </Fragment>
    );
  });
};

export default RenderRows;
