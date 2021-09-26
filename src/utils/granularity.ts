import React from "react"
import { parseNumber } from "./number_formatting"


const supportedCurrencies = {
    'BTC' : {
        name: "Bitcoin",
        symbol: "BTC",
        value: "BTC",
        type: "Crypto",
        rounding: 8
    },
    'BNB' : {
        name: "Binance Coin",
        symbol: "BNB",
        value: "BNB",
        type: "Crypto",
        rounding: 8
    },
    'USD' : {
        name: "US Dollar",
        symbol: "$",
        value: "USD",
        type: "USD",
        rounding: 2
    },
    'USDT' : {
        name: "Tether",
        symbol: "$",
        value: "USDT",
        type: "USD",
        rounding: 2
    },
    'USDC' : {
        name: "USD Coin",
        symbol: "$",
        value: "USDC",
        type: "USD",
        rounding: 2
    },
    'BUSD' : {
        name: "Binance USD",
        symbol: "BUSD",
        value: "BUSD",
        type: "USD",
        rounding: 2
    },
    'GBP' : {
        name: "British pound sterling ",
        symbol: "£",
        value: "GBP",
        type: "",
        rounding: 2
    },
    'ETH' : {
        name: "Ethereum",
        symbol: "",
        value: "ETH",
        type: "Crypto",
        rounding: 8
    },
    'EUR' : {
        name: "Euro",
        symbol: "€",
        value: "EUR",
        type: "",
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