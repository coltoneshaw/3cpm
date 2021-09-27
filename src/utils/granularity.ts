import React from "react"
import { parseNumber } from "./number_formatting"

const supportedCurrencies = {
    'AUD' : {
        name: "Australian Dollar",
        symbol: "A$",
        value: "AUD",
        type: "fiat",
        rounding: 2
    },
    'BIDR' : {
        name: "BinanceIDR",
        symbol: "Rp",
        value: "BIDR",
        type: "stablecoin",
        rounding: 2
    }, 
    'BTC' : {
        name: "Bitcoin",
        symbol: "BTC",
        value: "BTC",
        type: "crypto",
        rounding: 8
    },
    'BNB' : {
        name: "Binance Coin",
        symbol: "BNB",
        value: "BNB",
        type: "crypto",
        rounding: 8
    },
    'BRL' : {
        name: "Brazilian Real",
        symbol: "R$",
        value: "BRL",
        type: "fiat",
        rounding: 2
    },
    'BUSD' : {
        name: "Binance USD",
        symbol: "$",
        value: "BUSD",
        // pegged to USD
        type: "stablecoin",
        rounding: 2
    },
    'BVND' : {
        name: "Binance VND",
        symbol: "₫",
        value: "BVND",
        type: "stablecoin",
        rounding: 2
    },
    'DAI' : {
        name: "Binance VND",
        symbol: "DAI",
        value: "DAI",
        type: "stablecoin",
        // pegged to USD
        rounding: 3
    },
    'USD' : {
        name: "US Dollar",
        symbol: "$",
        value: "USD",
        type: "fiat",
        rounding: 2
    },
    'USDT' : {
        name: "Tether",
        symbol: "$",
        value: "USDT",
        type: "stablecoin",
        // pegged to USD
        rounding: 2
    },
    'USDC' : {
        name: "USD Coin",
        symbol: "$",
        value: "USDC",
        type: "stablecoin",
        // pegged to USD
        rounding: 2
    },
    'GBP' : {
        name: "British pound sterling ",
        symbol: "£",
        value: "GBP",
        type: "fiat",
        rounding: 2
    },
    'ETH' : {
        name: "Ethereum",
        symbol: "ETH",
        value: "ETH",
        type: "crypto",
        rounding: 8
    },
    'EUR' : {
        name: "Euro",
        symbol: "€",
        value: "EUR",
        type: "fiat",
        rounding: 2
    },
    'IDRT' : {
        name: "Rupiah Token",
        symbol: "Rp",
        value: "IDRT",
        type: "stablecoin",
        rounding: 2
    },
    'NGN' : {
        name: "Nigerian Naira",
        symbol: "₦",
        value: "NGN",
        type: "fiat",
        rounding: 2
    },
    'RUB' : {
        name: "Russian Ruble",
        symbol: "₽",
        value: "RUB",
        type: "fiat",
        rounding: 2
    },
    'TRX' : {
        name: "Tron",
        symbol: "TRX",
        value: "TRX",
        type: "crypto",
        rounding: 8
    },
    'TRY' : {
        name: "Turkish lira",
        symbol: "₺",
        value: "TRY",
        type: "fiat",
        rounding: 2
    },
    'TUSD' : {
        name: "TrueUSD",
        symbol: "$",
        value: "TUSD",
        type: "stablecoin",
        rounding: 2
    },
    'UAH' : {
        name: "Ukrainian hryvnia",
        symbol: "₴",
        value: "UAH",
        type: "fiat",
        rounding: 2
    },
    'VAI' : {
        name: "VAI",
        symbol: "VAI",
        value: "VAI",
        type: "crypto",
        rounding: 3
    },
    'XRP' : {
        name: "XRP",
        symbol: "XRP",
        value: "XRP",
        type: "crypto",
        rounding: 3
    },
    'USDP' : {
        name: "Pax Dollar",
        symbol: "$",
        value: "USDP",
        type: "stablecoin",
        rounding: 2
    },
}


const formatCurrency = (currencyCode:(keyof typeof supportedCurrencies)[], value:number, maxSize?:boolean) =>{

    // checking if an invalid currency exists in the array and not moving forward
    if(currencyCode.length === 0 || currencyCode.some( (cur:string) => !Object.keys(supportedCurrencies).includes(cur) )){
        console.error('No matching currency code found.')
        return {metric: 'error', symbol: ''}
    }

    // if(!round) return parseNumber(value, 0 )
    // TODO - Edit this so it dynamically checks the currency.
    const currencyValues = supportedCurrencies[currencyCode[0]];

    return {
        metric: parseNumber(value, currencyValues.rounding, maxSize ),
        symbol: currencyValues.symbol
    }
}

export {
    formatCurrency, 
    supportedCurrencies
}