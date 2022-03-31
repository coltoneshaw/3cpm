import {
  Column, UseExpandedInstanceProps, UseExpandedRowProps, UseTableRowProps, UseTableInstanceProps,
  UseTableCellProps, UseSortByOptions,
} from 'react-table';

import { ReservedFundsType } from 'types/config';

export interface TableRow extends UseExpandedRowProps<ReservedFundsType>, UseTableRowProps<ReservedFundsType> { }
export interface TableColumn extends UseExpandedInstanceProps<Column> { }
export interface Cell extends UseTableCellProps<ReservedFundsType> {
}

export interface SettingTableTypes
  extends UseTableInstanceProps<ReservedFundsType>,
  UseSortByOptions<ReservedFundsType> {
  row: TableRow
  column: TableColumn
  cell: Cell
  handleEditCellChangeCommitted: (id: number, column: string, value: string | boolean) => void
}
