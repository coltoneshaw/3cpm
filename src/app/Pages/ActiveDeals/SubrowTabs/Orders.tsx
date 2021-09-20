import React from "react";
import {parseNumber} from '@/utils/number_formatting'

const dateFormatter = (dateString:string) => new Date(dateString).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' , year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})

function Orders({row, ordersData}: any) {

    return ( <table className="table table-bordered table-striped RUBYDEV__deals_table_thead_border_fix">
        <thead>
        <tr>
            <th>Side</th>
            <th>Order Type</th>
            <th>Status</th>
            <th>Rate ({row.original.from_currency})</th>
            <th>Amount ({row.original.to_currency})</th>
            <th>Volume ({row.original.from_currency})</th>
            <th className="hidden-xs">Created</th>
            <th className="hidden-xs">Updated</th>
        </tr>
        </thead>
        <tbody>
        {ordersData.map((r:any) => (
            <tr key={"order-" + r.order_id}>
                <td>{r.order_type}</td>
                <td>{r.deal_order_type}</td>
                <td>{r.status_string}</td>
                <td>
                    { r.order_type == "BUY" && (<>Desired: {parseNumber( r.rate, 5)}<br/>Real: {parseNumber( r.average_price, 5)}</>)}
                    { r.order_type == "SELL" && (<>{parseNumber( r.rate, 5)}</>)}
                </td>
                <td>{parseNumber( +r.quantity, 5)}</td>
                <td>{parseNumber( r.total, 5)}</td>
                <td>{dateFormatter(r.created_at)}</td>
                <td>{dateFormatter(r.updated_at)}</td>
            </tr>)
        )}
        </tbody>
    </table>)
}

export default Orders