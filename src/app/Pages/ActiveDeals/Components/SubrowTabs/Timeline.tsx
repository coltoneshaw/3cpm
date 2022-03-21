import React, { useState } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';
import { parseNumber } from '@/utils/numberFormatting';
// import { formatCurrency } from '@/utils/granularity';

import { dynamicSort } from '@/utils/helperFunctions';
import type { MarketOrdersType, Deals } from '@/types/3CommasApi';
import { calcSafetyArray } from '@/utils/formulas';

const dateFormatter = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, {
  month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

const OrderTimeline = ({ row, ordersData }: { row: { original: Deals }, ordersData: MarketOrdersType[] }) => {
  const [future, updateFuture] = useState(false);
  const changeFuture = (event: React.ChangeEvent<HTMLInputElement>) => updateFuture(event.target.checked);

  // this has an error because the Deals should have the from_currency be a key
  // const formatCurrencyLocally = (value: number) => formatCurrency([row.original.from_currency], value).metric;

  const currentPrice = {
    order_id: 'current',
    order_type: '',
    deal_order_type: 'Current',
    status_string: '',
    rate: row.original.current_price,
    quantity: '',
    total: '',
    created_at: '',
    updated_at: '',
    average_price: row.original.current_price,
  };

  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    max_safety_orders, safety_order_volume, martingale_step_coefficient,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    martingale_volume_coefficient, safety_order_step_percentage,
  } = row.original;
  const basePrice = ordersData.find((o) => o.deal_order_type === 'Base') || { rate: 0 };
  // const baseSafety = ordersData.find(o => o.deal_order_type === 'Safety') || { rate: 0 };
  const placedSafeties = ordersData.filter((o) => o.deal_order_type === 'Safety' && o.status_string !== 'Cancelled');

  const safetyArray = calcSafetyArray(
    safety_order_volume,
    max_safety_orders,
    martingale_volume_coefficient,
    martingale_step_coefficient,
    safety_order_step_percentage,
  )
    .filter((so) => so.soCount > placedSafeties.length)
    .map((so) => {
      const rate = basePrice.rate - ((so.deviation / 100) * basePrice.rate);
      const quantity = so.volume / rate;

      return {
        order_id: `${so.soCount}safety`,
        order_type: 'BUY',
        deal_order_type: 'Safety',
        status_string: 'Future',
        rate,
        quantity,
        total: so.volume,
        created_at: '',
        updated_at: '',
      };
    });

  const sortedData = [
    ...ordersData,
    currentPrice,
    ...safetyArray,
  ].sort(dynamicSort('rate')).filter((r) => r.status_string !== 'Cancelled');

  const filterData = (data: any) => {
    if (future) return data;
    return data.filter((r: any) => r.status_string !== 'Future');
  };

  return (
    <div className="flex-column" style={{ width: '100%' }}>
      <FormControlLabel
        control={(
          <Checkbox
            checked={future}
            onChange={changeFuture}
            name="Show future SOs"
            style={{ color: 'var(--color-secondary)' }}

          />
        )}
        label="Show future SOs"
        style={{ marginBottom: '1em', alignSelf: 'center' }}
      />
      <table className="table table-bordered table-striped RUBYDEV__deals_table_thead_border_fix ">
        <thead>
          <tr>
            <th>Side</th>
            <th>Order Type</th>
            <th>Status</th>
            <th>
              Rate (
              {row.original.from_currency}
              )
            </th>
            <th>
              Amount (
              {row.original.to_currency}
              )
            </th>
            <th>
              Volume (
              {row.original.from_currency}
              )
            </th>
            <th className="hidden-xs">Created</th>
          </tr>
        </thead>
        <tbody className="dcaCalcTable">
          {filterData(sortedData).map((r: MarketOrdersType) => (
            <tr key={`order-${r.order_id}`} style={{ opacity: (r.status_string === 'Future') ? 0.6 : '' }}>
              <td>{r.order_type}</td>
              <td>{r.deal_order_type}</td>
              <td>{r.status_string}</td>
              <td className="monospace-cell">{(r.rate) ? parseNumber(r.rate, 6) : parseNumber(r.average_price, 6)}</td>
              <td className="monospace-cell">{(r.quantity) ? parseNumber(+r.quantity, 4) : '-'}</td>
              <td className="monospace-cell">{(r.total) ? parseNumber(r.total, 6) : '-'}</td>
              <td>{(r.created_at) ? dateFormatter(r.created_at) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTimeline;
