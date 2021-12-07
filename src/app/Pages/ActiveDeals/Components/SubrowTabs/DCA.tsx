import { Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { parseNumber } from '@/utils/number_formatting'


type calc = {
    addFunds: number
    atPrice: number
    tpPercent: number
}

const exchangeFee = 0.001

const calcNew = ({addFunds, atPrice, tpPercent}: calc, ordersData: any, currentPrice: string) => {
    const filteredData = ordersData.filter((r: any) => r.order_type === 'BUY' && r.status_string === 'Filled')
    const totalCrypto = filteredData.reduce((r: number, c: any) => {
        return r + parseFloat(c.quantity)
    }, 0) + addFunds / atPrice


    const totalSpent = filteredData.reduce((r: number, c: any) => {
        return r + parseFloat(c.total)
    }, 0) + addFunds

    const average = totalSpent / totalCrypto
    const tpAt = ( average * ( ( tpPercent / 100) + exchangeFee ) ) + average

    return {
        average,
        tpAt,
        gainRequired: ( ( ( tpAt / average ) - 1) + ((average / +currentPrice) -1) ) * 100
    }
}


type row = {
    bought_average_price: number,
    take_profit: number
    current_price: number
}

const calcOriginal = ({ bought_average_price, take_profit, current_price}: row ) => {
    const average = bought_average_price;
    const tpPercent = take_profit / 100;
    const tpAt = average * ( 1 + tpPercent + exchangeFee);
    return {
        average, 
        tpAt,
        gainRequired: ( ( ( tpAt / average ) - 1) + ((average / current_price) -1) ) * 100
    }

}

function DCA({ row, ordersData }: any) {


    const origCalc = calcOriginal(row.original)
    const [newCalc, setNewCalc] = useState(() => ({ average: origCalc.average, tpAt: origCalc.tpAt, gainRequired: origCalc.gainRequired }))

    const [addFunds, setAddFundsField] = useState<number>(0);
    const [atPrice, setAtPrice] = useState<number>(parseFloat(row.original.current_price));
    const [tpPercent, setTpPercent] = useState<number>(parseFloat(row.original.take_profit));

    useEffect(() => {
        if (isNaN(addFunds)) {
            setAddFundsField(0)
            return
        }

        // It's receiving the price in atPrice and using that as the TP price, I believe
        setNewCalc(calcNew({ addFunds, atPrice, tpPercent }, ordersData, row.original.current_price))

    }, [addFunds, atPrice, tpPercent])

    return (
        <div className="flex-column" style={{ width: '100%' }}>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <TextField label={"Add funds (" + row.original.from_currency + ")"} value={addFunds} onChange={event => {
                        setAddFundsField(parseFloat(event.target.value))
                    }} type="number" fullWidth />

                </Grid>
                <Grid item xs={4}>
                    <TextField label={"At Price (" + row.original.to_currency + ")"} value={atPrice} onChange={event => {
                        setAtPrice(parseFloat(event.target.value))
                    }} type="number" fullWidth />
                </Grid>
                <Grid item xs={4}>
                    <TextField label="Take Profit (%)" value={tpPercent} onChange={event => {
                        setTpPercent(parseFloat(event.target.value))
                    }} type="number" fullWidth />
                </Grid>
            </Grid>


            <table style={{ tableLayout: 'fixed', margin: 'auto', marginTop: "2rem", width: '70%', alignSelf: 'center' }} className="dcaTable">
                <thead>
                    <tr>
                        <th></th>
                        <th>Buy average</th>
                        <th>Take profit at</th>
                        <th>Take profit percent</th>
                        <th>Distance from TP</th>
                    </tr>
                </thead>
                <tbody className="dcaCalcTable">
                    <tr>
                        <td>Original</td>
                        <td className=" monospace-cell">{parseNumber(origCalc.average, 6)}</td>
                        <td className=" monospace-cell">{parseNumber(origCalc.tpAt, 6)}</td>
                        <td className=" monospace-cell">{parseNumber(row.original.take_profit, 2)}%</td>
                        <td className=" monospace-cell">{parseNumber(origCalc.gainRequired, 2)}%</td>
                    </tr>
                    <tr>
                        <td>New</td>
                        <td className=" monospace-cell">{parseNumber(newCalc.average, 6)}</td>
                        <td className=" monospace-cell">{parseNumber(newCalc.tpAt, 6)}</td>
                        <td className=" monospace-cell">{parseNumber(tpPercent, 2)}%</td>
                        <td className=" monospace-cell">{parseNumber(newCalc.gainRequired, 2)}%</td>
                    </tr>
                    <tr className="summaryRow">
                        <td>Difference</td>
                        <td className=" monospace-cell">{parseNumber(origCalc.average - newCalc.average, 6)}</td>
                        <td className=" monospace-cell">{parseNumber(origCalc.tpAt - newCalc.tpAt, 6)}</td>
                        <td className=" monospace-cell">{parseNumber(row.original.take_profit - tpPercent, 2)}%</td>
                        <td className=" monospace-cell">{parseNumber(origCalc.gainRequired - newCalc.gainRequired, 2)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>)
}

export default DCA