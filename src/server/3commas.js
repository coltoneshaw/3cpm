const threeCommasAPI = require('3commas-api-node')

async function bots() {
    const api = new threeCommasAPI({
      apiKey: 'e2b71dce655c46ddb9635111b2b5f2578e918e7fc67a4b5f9d3bfaa6d0883b19',
      apiSecret: 'a17c2149f5fc4a3a2b4d37beecf1a1642ee8e26e1fafdaee48db42f815fc99e2fb92311476762d454c988f161b777b3f9d231090da95bc6b428ccdffc6769f83e3bcaaa82732dd64e3f07b5be2be52ef9c19fc49fd0fee50827d7a3f0d1509d51dce3681',
    })
  
    let data = await api.getBots()
  
    return data
  }


exports.bots = bots