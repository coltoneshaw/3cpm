import { Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { parseNumber } from '@/utils/numberFormatting';
import { ActiveDeals, Type_MarketOrders } from '@/types/3Commas';

type calc = {
  addFunds: number
  atPrice: number
  tpPercent: number
};

type CalcObject = {
  average: number,
  tpAt: number,
  tpPercent: number,
  gainRequired: number,
  name: string,
  totalProfit: number
};

type row = {
  original: ActiveDeals
};

type DCAType = {
  row: row,
  ordersData: Type_MarketOrders[] | []
};

const exchangeFee = 0.001;

const calcNew = (
  { addFunds, atPrice, tpPercent }: calc,
  ordersData: Type_MarketOrders[],
  currentPrice: number,
  bought_volume: number,
) => {
  const filteredData = ordersData.filter((r) => r.order_type === 'BUY' && r.status_string === 'Filled');
  const totalCrypto = filteredData.reduce((r, c) => r + c.quantity, 0) + addFunds / atPrice;
  const totalSpent = filteredData.reduce((r, c) => r + c.total, 0) + addFunds;
  const average = totalSpent / totalCrypto;

  const tpAt = average * (1 + (tpPercent / 100) + exchangeFee);
  return {
    name: 'New',
    average,
    tpAt,
    gainRequired: (((tpAt / average) - 1) + ((average / +currentPrice) - 1)) * 100,
    tpPercent,
    totalProfit: (tpPercent / 100) * (bought_volume + addFunds),
  };
};

const calcOriginal = ({
  bought_average_price, take_profit, current_price, bought_volume,
}: ActiveDeals) => {
  const tpPercent = take_profit / 100;
  const tpAt = bought_average_price * (1 + tpPercent + exchangeFee);

  return {
    name: 'Original',
    average: bought_average_price,
    tpAt,
    gainRequired: (((tpAt / bought_average_price) - 1) + ((bought_average_price / current_price) - 1)) * 100,
    tpPercent: take_profit,
    totalProfit: (take_profit / 100) * bought_volume,
  };
};

const dcaTableData = (row: row, calc: calc, ordersData: Type_MarketOrders[]): CalcObject[] => {
  const original = calcOriginal(row.original);
  const newData = calcNew(calc, ordersData, row.original.current_price, row.original.bought_volume);
  const diff = {
    name: 'Difference',
    average: newData.average - original.average,
    tpAt: newData.tpAt - original.tpAt,
    tpPercent: newData.tpPercent - row.original.take_profit,
    gainRequired: newData.gainRequired - original.gainRequired,
    totalProfit: newData.totalProfit - original.totalProfit,
  };
  return [original, newData, diff];
};

const DCA = ({ row, ordersData }: DCAType) => {
  const [addFunds, setAddFundsField] = useState(0);
  const [atPrice, setAtPrice] = useState(row.original.current_price);
  const [tpPercent, setTpPercent] = useState(row.original.take_profit);

  const calcObject = dcaTableData(row, { addFunds, atPrice, tpPercent }, ordersData);

  useEffect(() => {
    if (Number.isNaN(addFunds)) {
      setAddFundsField(0);
    }
  }, [addFunds, atPrice, tpPercent]);

  return (
    <div className="flex-column" style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            label={`Add funds (${row.original.from_currency})`}
            value={addFunds}
            onChange={(event) => {
              setAddFundsField(parseFloat(event.target.value));
            }}
            type="number"
            fullWidth
          />

        </Grid>
        <Grid item xs={4}>
          <TextField
            label={`At Price (${row.original.to_currency})`}
            value={atPrice}
            onChange={(event) => {
              setAtPrice(parseFloat(event.target.value));
            }}
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Take Profit (%)"
            value={tpPercent}
            onChange={(event) => {
              setTpPercent(parseFloat(event.target.value));
            }}
            type="number"
            fullWidth
          />
        </Grid>
      </Grid>

      <table
        style={{
          tableLayout: 'fixed',
          margin: 'auto',
          marginTop: '2rem',
          width: '70%',
          alignSelf: 'center',
        }}
        className="table table-bordered table-striped RUBYDEV__deals_table_thead_border_fix"
      >
        <thead>
          <tr>
            <th />
            <th>Buy average</th>
            <th>Take profit at</th>
            <th>Take profit percent</th>
            <th>Distance from TP</th>
            <th>Total Profit</th>
          </tr>
        </thead>
        <tbody className="dcaCalcTable">
          {calcObject.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td className=" monospace-cell">{parseNumber(row.average, 6)}</td>
              <td className=" monospace-cell">{parseNumber(row.tpAt, 6)}</td>
              <td className=" monospace-cell">
                {parseNumber(row.tpPercent, 2)}
                %
              </td>
              <td className=" monospace-cell">
                {parseNumber(row.gainRequired, 2)}
                %
              </td>
              <td className=" monospace-cell">{parseNumber(row.totalProfit, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DCA;
