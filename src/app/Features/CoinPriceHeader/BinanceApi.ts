import fetch from 'electron-fetch'
import { BinanceTicketPrice } from '@/app/Repositories/Types/Binance'


const fetchCoinPricesBinance = async () => {


        try {
          let response = await fetch('https://api.binance.com/api/v3/ticker/price',
            {
              method: 'GET',
              timeout: 30000,
            })

          return await response.json<BinanceTicketPrice[]>()
        } catch (e) {
          console.log(e);
          return false
        }

}


export {
    fetchCoinPricesBinance
}