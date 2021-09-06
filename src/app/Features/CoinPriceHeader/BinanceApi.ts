// const queryString = require('query-string');

import fetch from 'electron-fetch'

const fetchCoinPricesBinance = async () => {


        try {
          let response = await fetch('https://api.binance.com/api/v3/ticker/price',
            {
              method: 'GET',
              timeout: 30000,
            })

          return await response.json()
        } catch (e) {
          console.log(e);
          return false
        }

}

// fetchCoinPricesBinance()
// .then(data => console.log(data))

export {
    fetchCoinPricesBinance
}