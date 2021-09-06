import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@material-ui/core";
import AddCoinModal from "./AddCoinModal";
import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

import './CoinPriceHeader.scss'

const CoinPriceHeader = () => {

    const [selectedCoins, updateSelectedcoins] = useState([])
    const [coinData, updateCoinData] = useState([])
    const [coinNames, updateCoinNames] = useState<string[]>([])

    const [open, setOpen] = useState(false)
    useEffect(() => {
        fetchNewCoinData('firstUpdate')
    }, [])

    const fetchNewCoinData = (update?: string) => {

        // @ts-ignore
        electron.binance.coinData()
            .then((data: any) => {
                // console.log(data)

                //@ts-ignore
                const filteredCoins = data.filter((coin: any) => selectedCoins.includes(coin.symbol))
                console.info('getting new coin data.')
                console.log(selectedCoins)

                updateCoinData(filteredCoins)

                if (update === 'firstUpdate') updateCoinNames(data.map((coin: any) => coin.symbol))

            })
    }

    

    useEffect(() => {
        //@ts-ignore
        const coinRefresh = setInterval(() => { fetchNewCoinData() }, 5000)
        return () => { clearInterval(coinRefresh) }
    }, [selectedCoins])

    useEffect(() => {
        //@ts-ignore
        const filteredCoins = coinData.filter((coin: any) => selectedCoins.includes(coin.symbol))
        updateCoinData(filteredCoins)
    }, [selectedCoins])

    

    useEffect(() => {
        const coinPriceArray = getStorageItem(storageItem.settings.coinPriceArray)
        updateSelectedcoins(prevState => (coinPriceArray != undefined && coinPriceArray.length > 0) ? coinPriceArray : ['BTCUSDT'])
    }, [])



    return (
        <div className="BtcPriceSpan monospace-cell">
            <AddCoinModal open={open} setOpen={setOpen} coinNames={coinNames} currentCoins={{ selectedCoins, updateSelectedcoins }} />
            <div className="coinDiv">
                {coinData.map((coin: { symbol: string, price: string }, index) => {
                    return <span
                        key={coin.symbol}>
                        {coin.symbol}: {Number(coin.price).toLocaleString('fullwide', { useGrouping: true, maximumSignificantDigits: 5 })}{(coinData.length > 1 && index != (coinData.length - 1)) ? ' - ' : ''}
                    </span>
                })}

            </div>
            <div style={{
                alignSelf: "flex-end",
                paddingRight: '1em'
            }}>
                <Button
                    className="coinHeaderButton"
                    onClick={() => {
                        console.log('you clicked the button, jimmy!')
                        setOpen(prevState => !prevState)

                    }}
                    style={{
                        fontSize: '.95em !important'
                    }}
                >
                    Add
                </Button>
            </div>
        </div>
    )
}

export default CoinPriceHeader;