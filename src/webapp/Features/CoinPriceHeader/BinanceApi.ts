import fetch from 'electron-fetch';
import { BinanceTicketPrice } from '@/webapp/Repositories/Types/Binance';
import { logToConsole } from '@/utils/logging';

const fetchCoinPricesBinance = async () => {
  try {
    const response = await fetch(
      'https://api.binance.com/api/v3/ticker/price',
      {
        method: 'GET',
        timeout: 30000,
      },
    );

    return await response.json<BinanceTicketPrice[]>();
  } catch (e) {
    logToConsole('error', e);
    return false;
  }
};

export default fetchCoinPricesBinance;
