import {
  Column, UseExpandedInstanceProps, UseExpandedRowProps, UseTableRowProps, UseTableInstanceProps,
  UseTableCellProps, UseSortByOptions,
} from 'react-table';

import type { QueryBotsType } from 'types/DatabaseQueries';

export interface TableRow extends UseExpandedRowProps<QueryBotsType>, UseTableRowProps<QueryBotsType> { }
export interface TableColumn extends UseExpandedInstanceProps<Column> { }
export interface Cell extends UseTableCellProps<QueryBotsType> {
}

export interface BotTableTypes
  extends UseTableInstanceProps<QueryBotsType>,
  UseSortByOptions<QueryBotsType> {
  row: TableRow
  column: TableColumn
  cell: Cell
  handleEditCellChangeCommitted: (id: number, column: string, value: string | boolean) => void
}
