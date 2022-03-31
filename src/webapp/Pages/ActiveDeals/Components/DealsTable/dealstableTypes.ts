import {
  Column, UseExpandedInstanceProps, UseExpandedRowProps, UseTableRowProps, UseTableInstanceProps,
  UseTableCellProps, UseSortByOptions,
} from 'react-table';

import type { ActiveDeals } from 'types/DatabaseQueries';

export interface TableRow extends UseExpandedRowProps<ActiveDeals>, UseTableRowProps<ActiveDeals> { }
export interface TableColumn extends UseExpandedInstanceProps<Column> { }
export interface Cell extends UseTableCellProps<ActiveDeals> { }

export interface TableCell
  extends UseTableInstanceProps<ActiveDeals>,
  UseSortByOptions<ActiveDeals> {
  row: TableRow
  column: TableColumn
  cell: Cell
}
