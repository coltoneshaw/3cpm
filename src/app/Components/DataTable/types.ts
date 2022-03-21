import type {
  TableCommonProps,
  TableOptions,
} from 'react-table';

import React from 'react';
import type { ActiveDeals, QueryBotsType } from '@/types/3CommasApi';
import { SubRowAsync } from '@/app/Pages/ActiveDeals/Components';

export interface TableType extends TableOptions<{}> {
  renderRowSubComponent?: typeof SubRowAsync | undefined,
  columns: any[],
  data: ActiveDeals[] | any[]
  customHeaderProps?: TableCommonProps,
  customColumnProps?: TableCommonProps,
  customRowProps?: TableCommonProps,
  customCellProps?: TableCommonProps
  localStorageSortName?: string,
  updateLocalBotData?:
  (id: number, column: string, value: string) => void | React.Dispatch<React.SetStateAction<QueryBotsType[]>>,
  updateReservedFunds?: (id: number, column: string, value: string) => void,
}
