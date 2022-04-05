import { logToConsole } from 'common/utils/logging';
import { BinanceTicketPrice } from 'common/repositories/Types/Binance';

async function fetchCoinPricesBinance() {
  try {
    const response = await fetch(
      'https://api.binance.com/api/v3/ticker/price',
      {
        method: 'GET',
      },
    );

    return await response.json() as BinanceTicketPrice[];
  } catch (e) {
    logToConsole('error', e);
    return [];
  }
}

export default fetchCoinPricesBinance;
