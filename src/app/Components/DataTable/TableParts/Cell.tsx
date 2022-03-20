import React, { CSSProperties, Key } from 'react';
import { Cell, TableCommonProps } from 'react-table';
import classNames from 'classnames';

type IndividualCell = {
  className: string | undefined
  style: CSSProperties | undefined
  maxWidth: undefined | number
  align: string
  cellKey: Key;
  func: (type: string, userProps?: object | undefined) => React.ReactNode
  customCellProps: TableCommonProps | { style: {}, className: '', role: undefined } | undefined
};

const RenderIndividualCell: React.FC<IndividualCell> = ({
  className = '', style = {},
  maxWidth = undefined,
  align,
  func,
  cellKey,
  customCellProps,
}) => (
  <div
    className={classNames('td', className, customCellProps?.className)}
    style={{
      ...style,
      maxWidth: (maxWidth) ? `${maxWidth}px` : undefined,
      justifyContent: align,
      alignItems: 'center',
      display: 'flex',
      ...customCellProps?.style,
    }}
    role="cell"
    key={cellKey}
  >
    {func('Cell')}
  </div>
);
const RenderCells = (
  cells: Cell<object, any>[],
  customCellProps: undefined | TableCommonProps,
) => {
  if (!cells) return null;
  const mappedCells = cells;

  return mappedCells.map((cell) => {
    const cellProps = cell.getCellProps();
    const maxWidth = cell.column?.maxWidth;
    const align = cell.column?.align ?? undefined;

    return (
      <RenderIndividualCell
        className={cellProps.className}
        style={cellProps?.style}
        maxWidth={maxWidth}
        align={align}
        key={cellProps.key}
        cellKey={cellProps.key}
        func={cell.render}
        customCellProps={customCellProps}
      />
    );
  });
};

export default RenderCells;
