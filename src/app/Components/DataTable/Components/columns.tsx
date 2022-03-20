import React from 'react';
import { formatCurrency, CurrencyKeys } from '@/utils/granularity';

export const numberCell = (
  value: string | number | undefined,
  format?: boolean,
  currency?: CurrencyKeys,
  style?: React.CSSProperties,
) => {
  let valueIs = value;
  if (format && currency && value) {
    valueIs = formatCurrency([currency], Number(value), true).metric;
  }
  return (
    <span
      className=" monospace-cell"
      style={style}
    >
      {valueIs}
    </span>
  );
};

export const formattedHeader = (text: string) => (
  <span style={{ width: '100%', textAlign: 'left', paddingLeft: '3px' }}>{text}</span>
);
