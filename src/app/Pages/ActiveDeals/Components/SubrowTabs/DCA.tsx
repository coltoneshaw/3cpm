import { Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { parseNumber } from '@/utils/number_formatting'

const calcTpPrice = (currentPrice: number, tpPrice: number) => ((tpPrice - currentPrice) / currentPrice) * 100

const calculate = (addFunds: number, atPrice: number, tpPercent: number, ordersData: any) => {
    const filteredData = ordersData.filter((r: any) => r.order_type === 'BUY' && r.status_string === 'Filled')
    const totalCrypto = filteredData.reduce((r: number, c: any) => {
        return r + parseFloat(c.quantity)
    }, 0) + addFunds / atPrice


    const totalSpent = filteredData.reduce((r: number, c: any) => {
        return r + parseFloat(c.total)
    }, 0) + addFunds

    const average = totalSpent / totalCrypto
    const tpAt = average + (average * tpPercent / 100)

    return {
        average,
        tpAt,
        gainRequired: calcTpPrice(atPrice, tpAt)
    }
}

function DCA({ row, ordersData }: any) {


    const origCalc = calculate(0, row.original.current_price, row.original.take_profit, ordersData)

    const [newCalc, setNewCalc] = useState(() => ({ average: origCalc.average, tpAt: origCalc.tpAt, gainRequired: origCalc.gainRequired }))

    const [addFunds, setAddFundsField] = useState<number>(0);
    const [atPrice, setAtPrice] = useState<number>(parseFloat(row.original.current_price));
    const [tpPercent, setTpPercent] = useState<number>(parseFloat(row.original.take_profit));

    useEffect(() => {
        if (isNaN(addFunds)) {
            setAddFundsField(0)
            return
        }
        setNewCalc( calculate(addFunds, atPrice, tpPercent, ordersData) )

    }, [addFunds, atPrice, tpPercent])





    return (<>
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


        <table style={{tableLayout: 'fixed', width: '50%', margin: 'auto',  marginTop: "2rem", }}>
            <thead>
                <tr>
                    <th></th>
                    <th>Buy average</th>
                    <th >Take Profit At</th>
                    <th >Take Profit percent</th>
                    <th>Gain to TP</th>
                </tr>
            </thead>
            <tbody className="dcaCalcTable">
                <tr>
                    <td>Original</td>
                    <td className=" monospace-cell">{parseNumber(origCalc.average, 5)}</td>
                    <td className=" monospace-cell">{parseNumber(origCalc.tpAt, 5)}</td>
                    <td className=" monospace-cell">{parseNumber(row.original.take_profit, 2)}%</td>
                    <td className=" monospace-cell">{parseNumber(origCalc.gainRequired, 2)}%</td>
                </tr>
                <tr>
                    <td>New</td>
                    <td className=" monospace-cell">{parseNumber(newCalc.average, 5)}</td>
                    <td className=" monospace-cell">{parseNumber(newCalc.tpAt, 5)}</td>
                    <td className=" monospace-cell">{parseNumber(tpPercent, 2)}%</td>
                    <td className=" monospace-cell">{parseNumber(newCalc.gainRequired, 2)}%</td>
                </tr>
                <tr className="summaryRow"> 
                    <td>Difference</td>
                    <td className=" monospace-cell">{parseNumber(origCalc.average - newCalc.average, 5)}</td>
                    <td className=" monospace-cell">{parseNumber(origCalc.tpAt - newCalc.tpAt, 5)}</td>
                    <td className=" monospace-cell">{parseNumber(row.original.take_profit - tpPercent, 2)}%</td>
                    <td className=" monospace-cell">{parseNumber(origCalc.gainRequired - newCalc.gainRequired, 2)}%</td>
                </tr>
            </tbody>
        </table>
    </>)
}

export default DCA