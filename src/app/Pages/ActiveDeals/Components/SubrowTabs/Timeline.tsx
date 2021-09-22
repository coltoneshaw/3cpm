import React from "react";
import {parseNumber} from '@/utils/number_formatting'
import { dynamicSort } from "@/utils/helperFunctions";
import type { Type_MarketOrders } from '@/types/3Commas'

const dateFormatter = (dateString:string) => new Date(dateString).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' , year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})

const OrderTimeline = ({row, ordersData}: {row: any, ordersData: Type_MarketOrders[]}) => {

   // filter out the cancelled deals
   // order deals by the price in which they trigger
   // include next SO.
   const currentPrice = {
       order_type: '',
       deal_order_type: 'Current',
       status_string: '',
       rate: row.original.current_price,
       quantity: '',
       total: '',
       created_at: '',
       updated_at: ''
   }

   const sortedData = [...ordersData, currentPrice].sort(dynamicSort('rate')).filter(r => r.status_string != 'Cancelled')

    return ( 
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
        <tbody  className="dcaCalcTable">
        {sortedData.map((r:any) => (
            <tr key={"order-" + r.order_id}>
                <td>{r.order_type}</td>
                <td>{r.deal_order_type}</td>
                <td>{r.status_string}</td>
                <td className="monospace-cell">{r.rate}</td>
                <td className="monospace-cell">{(r.quantity) ? parseNumber( +r.quantity, 5) : '-'}</td>
                <td className="monospace-cell">{(r.total) ? parseNumber( r.total, 5) : '-'}</td>
                <td>{(r.created_at) ? dateFormatter(r.created_at) : ''}</td>
                <td>{(r.updated_at) ? dateFormatter(r.updated_at): ''}</td>
            </tr>)
        )}
        </tbody>
    </table>)
}

export default OrderTimeline