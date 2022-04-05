import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useAppSelector } from 'webapp/redux/hooks';
import { getStorageItem, storageItem } from 'webapp/Features/LocalStorage/LocalStorage';
import type { BinanceTicketPrice } from 'common/repositories/Types/Binance';
import fetchCoinPricesBinance from './BinanceApi';
import AddCoinModal from './AddCoinModal';

import './CoinPriceHeader.scss';

const CoinPriceHeader = () => {
  const [coinData, updateCoinData] = useState<BinanceTicketPrice[]>([]);
  const [selectedCoins, updateSelectedCoins] = useState<string[]>([]);
  const [coinNames, updateCoinNames] = useState<string[]>([]);

  const fetchNewCoinData = (update?: string) => {
    fetchCoinPricesBinance()
      .then((data) => {
        if (!data || selectedCoins.length === 0) return;
        const filteredCoins = data.filter((coin) => selectedCoins.includes(coin.symbol));
        updateCoinData(filteredCoins);
        if (update === 'firstUpdate') updateCoinNames(data.map((coin) => coin.symbol));
      });
  };

  const { currentProfile } = useAppSelector((state) => state.config);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchNewCoinData('firstUpdate');
  }, []);

  useEffect(() => {
    const coinRefresh = setInterval(fetchNewCoinData, 5000);
    return () => { clearInterval(coinRefresh); };
  }, [selectedCoins]);

  useEffect(() => {
    const filteredCoins = coinData.filter((coin) => selectedCoins.includes(coin.symbol));
    updateCoinData(filteredCoins);
  }, [selectedCoins]);

  useEffect(() => {
    const coinPriceArray = getStorageItem(storageItem.settings.coinPriceArray);
    const selected = (coinPriceArray) || ['BTCUSDT'];
    updateSelectedCoins(selected);
  }, []);

  return (
    <div className="BtcPriceSpan monospace-cell" style={{ color: 'var(--color-text-lightbackground)' }}>
      <p style={{ padding: 0, margin: 0, paddingLeft: '1em' }}>
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
