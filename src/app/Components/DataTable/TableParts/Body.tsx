import React from 'react';
import {
  TableBodyProps,
  TableCommonProps,
  ColumnInstance,
  Row,
} from 'react-table';
import classNames from 'classnames';
import RenderRows from './Row';

import { SubRowAsync } from '@/app/Pages/ActiveDeals/Components';

type TypeTableBody = {
  bodyProps: TableBodyProps,
  customRowProps: TableCommonProps,
  customCellProps: TableCommonProps,
  prepareRow: (row: Row<object>) => void;
  visibleColumns: ColumnInstance<object>[];
  renderRowSubComponent: typeof SubRowAsync | undefined,
  rows: Row<object>[]
};

const TableBody: React.FC<TypeTableBody> = ({
  bodyProps,
  customCellProps,
  customRowProps,
  prepareRow,
  visibleColumns,
  renderRowSubComponent,
  rows,
}) => (

  <div
    // Table body element
    style={bodyProps?.style}
    className={classNames('tbody', bodyProps.className)}
    role="rowgroup"
    key="table-body"
  >
    {RenderRows(
      rows,
      customCellProps,
      customRowProps,
      prepareRow,
      visibleColumns,
      renderRowSubComponent,
    )}
  </div>
);

export default TableBody;
