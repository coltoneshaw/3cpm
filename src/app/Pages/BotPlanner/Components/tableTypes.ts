import {
  Column, UseExpandedInstanceProps, UseExpandedRowProps, UseTableRowProps, UseTableInstanceProps,
  UseTableCellProps, UseSortByOptions,
} from 'react-table';

import type { QueryBotsType } from '@/types/3CommasApi';

export interface TableRow extends UseExpandedRowProps<QueryBotsType>, UseTableRowProps<QueryBotsType> { }
export interface TableColumn extends UseExpandedInstanceProps<Column> { }
export interface Cell extends UseTableCellProps<QueryBotsType> { }

export interface TableCell
  extends UseTableInstanceProps<QueryBotsType>,
  UseSortByOptions<QueryBotsType> {
  row: TableRow
  column: TableColumn
  cell: Cell
}
