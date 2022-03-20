import {
  Column, UseExpandedInstanceProps, UseExpandedRowProps, UseTableRowProps, UseTableInstanceProps,
  UseTableCellProps, UseSortByOptions,
} from 'react-table';

import type { Type_Query_bots } from '@/types/3CommasApi';

export interface TableRow extends UseExpandedRowProps<Type_Query_bots>, UseTableRowProps<Type_Query_bots> { }
export interface TableColumn extends UseExpandedInstanceProps<Column> { }
export interface Cell extends UseTableCellProps<Type_Query_bots> { }

export interface TableCell
  extends UseTableInstanceProps<Type_Query_bots>,
  UseSortByOptions<Type_Query_bots> {
  row: TableRow
  column: TableColumn
  cell: Cell
}
