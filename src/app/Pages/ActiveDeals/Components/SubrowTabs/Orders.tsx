import React from "react";
import { formatCurrency } from '@/utils/granularity'

const dateFormatter = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })

function Orders({ row, ordersData }: any) {

    const formatCurrencyLocally = (value: number) => formatCurrency([row.original.from_currency], value).metric


    return (
        <div className="flex-column" style={{width: '100%'}}>
            <table className="table table-bordered table-striped RUBYDEV__deals_table_thead_border_fix ">
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
                <tbody className="dcaCalcTable">
                    {ordersData.map((r: any) => (
                        <tr key={"order-" + r.order_id}>
                            <td>{r.order_type}</td>
                            <td>{r.deal_order_type}</td>
                            <td>{r.status_string}</td>
                            <td className=" monospace-cell" style={{ textAlign: 'left' }}>
                                {r.order_type == "BUY" && (<>Desired: {formatCurrencyLocally(r.rate)}<br />Real: {formatCurrencyLocally(r.average_price)}</>)}
                                {r.order_type == "SELL" && (<>{formatCurrencyLocally(r.rate)}</>)}
                            </td>
                            <td className=" monospace-cell">{formatCurrencyLocally(+r.quantity)}</td>
                            <td className=" monospace-cell">{(r.total) ? formatCurrencyLocally(r.total) : '-'}</td>
                            <td>{dateFormatter(r.created_at)}</td>
                            <td>{dateFormatter(r.updated_at)}</td>
                        </tr>)
                    )}
                </tbody>
            </table>
        </div>)
}

export default Orders