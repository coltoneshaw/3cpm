import React, { useState } from "react";
import { parseNumber } from '@/utils/number_formatting'
import {formatCurrency, supportedCurrencies} from'@/utils/granularity'

import { dynamicSort } from "@/utils/helperFunctions";
import type { Type_MarketOrders, Type_Deals } from '@/types/3Commas'
import { calc_SafetyArray } from "@/utils/formulas";
import { FormControlLabel, Checkbox } from '@mui/material';



const dateFormatter = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })

const OrderTimeline = ({ row, ordersData }: { row: { original: Type_Deals }, ordersData: Type_MarketOrders[] }) => {
    const [future, updateFuture] = useState(false)
    const changeFuture = (event: React.ChangeEvent<HTMLInputElement>) => updateFuture(event.target.checked)

    // this has an error because the Type_Deals should have the from_currency be a key
    const formatCurrencyLocally = (value:number) =>  formatCurrency([row.original.from_currency], value).metric


    const currentPrice = {
        order_id: 'current',
        order_type: '',
        deal_order_type: 'Current',
        status_string: '',
        rate: row.original.current_price,
        quantity: '',
        total: '',
        created_at: '',
        updated_at: '',
        average_price: row.original.current_price,
    }

    const { max_safety_orders, safety_order_volume, martingale_step_coefficient, martingale_volume_coefficient, completed_safety_orders_count, safety_order_step_percentage } = row.original
    const basePrice = ordersData.find(o => o.deal_order_type === 'Base') || { rate: 0 };
    const placedSafeties = ordersData.filter(o => o.deal_order_type === 'Safety' && o.status_string != 'Cancelled');


    const safetyArray = calc_SafetyArray(safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, martingale_step_coefficient, safety_order_step_percentage)
        .filter(so => so.so_count > placedSafeties.length)
        .map(so => {
            const rate = basePrice.rate - ((so.deviation / 100) * basePrice.rate)
            return {
                order_id: so.so_count + 'safety',
                order_type: 'BUY',
                deal_order_type: 'Safety',
                status_string: 'Future',
                rate,
                quantity: so.volume / rate,
                total: so.volume,
                created_at: '',
                updated_at: '',
            }
        })

    const sortedData = [...ordersData, currentPrice, ...safetyArray].sort(dynamicSort('rate')).filter(r => r.status_string != 'Cancelled')

    const filterData = (data: any) => {
        if (future) return data
        return data.filter((r: any) => r.status_string !== 'Future')
    }


    return (
        <>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={future}
                        onChange={changeFuture}
                        name="Show future SOs"
                        style={{ color: 'var(--color-secondary)' }}

                    />
                }
                label="Show future SOs"
                style={{ marginBottom: '1em' }}
            />
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
                    </tr>
                </thead>
                <tbody className="dcaCalcTable">
                    {filterData(sortedData).map((r: Type_MarketOrders) => (
                        <tr key={"order-" + r.order_id} style={{ opacity: (r.status_string === 'Future') ? .6 : '' }} >
                            <td>{r.order_type}</td>
                            <td>{r.deal_order_type}</td>
                            <td>{r.status_string}</td>
                            <td className="monospace-cell">{(r.rate) ? formatCurrencyLocally(r.rate) : formatCurrencyLocally(r.average_price)}</td>
                            <td className="monospace-cell">{(r.quantity) ? formatCurrencyLocally(+r.quantity) : '-'}</td>
                            <td className="monospace-cell">{(r.total) ? formatCurrencyLocally(r.total) : '-'}</td>
                            <td>{(r.created_at) ? dateFormatter(r.created_at) : '-'}</td>
                        </tr>)
                    )}
                </tbody>
            </table>
        </>
    )
}

export default OrderTimeline