import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useAppSelector } from 'webapp/redux/hooks';
import { getStorageItem, storageItem } from 'webapp/Features/LocalStorage/LocalStorage';
import fetchHandler from 'webapp/utils/fetchHandler';
import type { BinanceTicketPrice } from './binanceTypes';
import AddCoinModal from './AddCoinModal';

import useInterval from '@/webapp/utils/customHooks/useInterval';

import './CoinPriceHeader.scss';

const fetchNewCoinData = async () => {
  const coinResponse = await fetchHandler<BinanceTicketPrice[]>('https://api.binance.com/api/v3/ticker/price');
  if (coinResponse instanceof Error || !coinResponse) return undefined;
  return coinResponse;
};

const CoinPriceHeader = () => {
  const [status, setStatus] = useState<'idle' | 'running'>('idle');
  const [coinData, updateCoinData] = useState<BinanceTicketPrice[]>([]);
  const [selectedCoins, updateSelectedCoins] = useState<string[]>([]);
  const [coinNames, updateCoinNames] = useState<string[]>([]);

  const { currentProfile } = useAppSelector((state) => state.config);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const coinPriceArray = getStorageItem(storageItem.settings.coinPriceArray) as string[];
    const freshSelected = coinPriceArray ?? ['BTCUSDT'];
    updateSelectedCoins(freshSelected);
  }, []);

  useInterval(
    async () => {
      const fetchedCoinData = await fetchNewCoinData();
      if (!fetchedCoinData || fetchedCoinData.length === 0) return;
      updateCoinNames(fetchedCoinData.map((coin) => coin.symbol));
      updateCoinData(fetchedCoinData.filter((coin) => selectedCoins.includes(coin.symbol)));
    },
    (status === 'running' && selectedCoins.length > 0) ? 5000 : null,
  );

  useEffect(() => {
    // on first load of having coins, set the status to running.
    if (selectedCoins.length > 0) setStatus('running');
    return () => setStatus('idle');
  }, [selectedCoins]);

  // useEffect(() => {
  //   if (!selectedCoins || selectedCoins.length === 0) return undefined;
  //   // creating the initial coin refresh.
  //   const coinRefresh = setTimeout(, 5000);

  //   return () => clearTimeout(coinRefresh);
  // }, [selectedCoins]);

  return (
    <div className="BtcPriceSpan monospace-cell" style={{ color: 'var(--color-text-lightbackground)' }}>
      <p
        style={{
          padding: 0,
          margin: 0,
          paddingLeft: '1em',
        }}
      >
        Profile:
        {' '}
        {currentProfile.name}
      </p>
      <AddCoinModal
        open={open}
        setOpen={setOpen}
        coinNames={coinNames}
        currentCoins={{ selectedCoins, updateSelectedCoins }}
      />
      <div className="coinDiv">
        {coinData.map((coin: { symbol: string, price: string }, index) => (
          <span
            key={coin.symbol}
            style={{ paddingLeft: '1em' }}
          >
            {coin.symbol}
            :
            {Number(coin.price).toLocaleString('fullwide', { useGrouping: true, maximumSignificantDigits: 5 })}
            {(coinData.length > 1 && index !== (coinData.length - 1)) ? ' - ' : ''}
          </span>
        ))}

      </div>
      <div style={{
        alignSelf: 'flex-end',
        paddingRight: '1em',
      }}
      >
        <Button
          className="coinHeaderButton"
          onClick={() => {
            setOpen((prevState) => !prevState);
          }}
          style={{
            fontSize: '.95em !important',
            color: 'var(--color-text-lightbackground)',
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default CoinPriceHeader;
