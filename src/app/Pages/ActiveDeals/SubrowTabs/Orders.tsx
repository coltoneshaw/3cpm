import React from "react";


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
                    { r.order_type == "BUY" && (<>Desired: {r.rate}<br/>Real: {r.average_price}</>)}
                    { r.order_type == "SELL" && (<>{r.rate}</>)}
                </td>
                <td>{r.quantity}</td>
                <td>{r.total}</td>
                <td>{r.created_at}</td>
                <td>{r.updated_at}</td>
            </tr>)
        )}
        </tbody>
    </table>)
}

export default Orders