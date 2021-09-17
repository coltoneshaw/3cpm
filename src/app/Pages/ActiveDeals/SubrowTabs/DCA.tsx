import {Grid, TextField} from "@material-ui/core";
import React, {useEffect} from "react";

function DCA({row, ordersData}:any) {


    const calculate = (addFunds: number, atPrice: number, tpPercent: number) => {
        const filteredData = ordersData.filter((r:any) => r.order_type === 'BUY' && r.status_string === 'Filled')
        const totalCrypto = filteredData.reduce((r:number, c:any) => {
            return r + parseFloat(c.quantity)
        }, 0) + addFunds / atPrice


        const totalSpent = filteredData.reduce((r:number, c:any) => {
            return r + parseFloat(c.total)
        }, 0) + addFunds

        const average = totalSpent/totalCrypto

        return {
            average: average,
            tpAt: average+(average*tpPercent/100),
        }
    }


    const [avg, setAvg] = React.useState<number>(0);
    const [tpAt, setTpAt] = React.useState<number>(0);

    const [addFunds, setAddFundsField] = React.useState<number>(0);
    const [atPrice, setAtPrice] = React.useState<number>(parseFloat(row.original.current_price));
    const [tpPercent, setTpPercent] = React.useState<number>(parseFloat(row.original.take_profit));
    useEffect(() => {
        if (isNaN(addFunds)) {
            setAddFundsField(0)
            return
        }
        const {average , tpAt} = calculate(addFunds, atPrice, tpPercent)
        setAvg(average)
        setTpAt(tpAt)
    }, [addFunds, atPrice, tpPercent])

    const {average: originalAvg , tpAt: originalTPAt} = calculate(0, row.original.current_price, row.original.take_profit)




    return (<>
        <Grid container spacing={3}>
        <Grid item xs={4}>
            <TextField label={"Add funds (" + row.original.from_currency + ")"} value={addFunds} onChange={event => {
                setAddFundsField(parseFloat(event.target.value))
            }} type="number" fullWidth/>

        </Grid>
        <Grid item xs={4}>
            <TextField label={"At Price (" + row.original.to_currency + ")"} value={atPrice} onChange={event => {
                setAtPrice(parseFloat(event.target.value))
            }} type="number" fullWidth/>
        </Grid>
        <Grid item xs={4}>
            <TextField label="Take Profit (%)" value={tpPercent} onChange={event => {
                setTpPercent(parseFloat(event.target.value))
            }} type="number" fullWidth/>
        </Grid>
    </Grid>



    <table style={{marginTop: "1rem"}}>
        <thead>
        <tr>
            <th></th>
            <th>Buy average</th>
            <th>Take Profit At</th>
            <th>Take Profit percent</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Original</td>
            <td>{ originalAvg }</td>
            <td>{ originalTPAt }</td>
            <td>{ row.original.take_profit }%</td>
        </tr>
        <tr>
            <td>New</td>
            <td>{ avg }</td>
            <td>{ tpAt }</td>
            <td>{ tpPercent}%</td>
        </tr>
        <tr>
            <td>Diff</td>
            <td>{ originalAvg - avg }</td>
            <td>{ originalTPAt - tpAt }</td>
            <td>{ row.original.take_profit - tpPercent}%</td>
        </tr>
        </tbody>
    </table>
        </>)
}

export default DCA