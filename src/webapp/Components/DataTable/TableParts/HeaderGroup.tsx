/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import {
  HeaderGroup,
  TableCommonProps,
} from 'react-table';
import classNames from 'classnames';

import { sortReturn } from '../utils';

type TypeTableHeader = {
  headerGroups: HeaderGroup<object>[],
  customHeaderProps: TableCommonProps,
  customColumnProps: TableCommonProps,
};

const RenderHeader = (
  headers: HeaderGroup<object>[],
  customHeaderProps: TableCommonProps,
  customColumnProps: TableCommonProps,
) => headers.map((column) => {
  const columnProps = column.getHeaderProps();
  const sortByProps = column.getSortByToggleProps();
  return (
    <div // Return an array of prop objects and react-table will merge them appropriately
      tabIndex={0}
      onClick={sortByProps.onClick}
      title={sortByProps.title}
      style={{
        ...columnProps.style,
        ...sortByProps?.style,
        maxWidth: (column.maxWidth) ? column.maxWidth : undefined,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        padding: '5px 0',
        height: '44px',
        ...customHeaderProps?.style,
      }}
      key={columnProps.key}
      role="button"
      className={classNames('th', customColumnProps?.className, columnProps.className)}
    >
      {column.render('Header')}
      {column.canSort && (
        <span
          style={{
            paddingLeft: '.5em',
            ...customColumnProps?.style,
          }}
        >
          {sortReturn(column.isSorted, column.isSortedDesc)}
        </span>
      )}

    </div>
  );
});

const RenderHeaderGroup = (
  headerGroups: HeaderGroup<object>[],
  customHeaderProps: TableCommonProps,
  customColumnProps: TableCommonProps,
) => headerGroups.map((headerGroup) => {
  const header = headerGroup.getHeaderGroupProps();
  return (
    <div
      className={classNames('tr', header.className, customHeaderProps.className)}
      key={header.key}
      style={{
        ...header.style,
        ...customHeaderProps?.style,
      }}
      role={customHeaderProps?.role ?? header.role}
    >
      {RenderHeader(
        headerGroup.headers,
        customHeaderProps,
        customColumnProps,
      )}
    </div>
  );
});

const TableHeader: React.FC<TypeTableHeader> = ({
  headerGroups, customColumnProps, customHeaderProps,
}) => (
  <div
    style={{
      textAlign: 'center',
    }}
    className="thead"
    key="test"
  >
    {RenderHeaderGroup(
      headerGroups,
      customHeaderProps,
      customColumnProps,
    )}
  </div>
);

export default TableHeader;
