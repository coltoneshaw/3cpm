import { Type_ActiveDeals } from "@/types/3Commas"
import { calc_dropMetrics, calc_deviation } from '@/utils/formulas'
import { parseNumber } from '@/utils/number_formatting';


const formatDeals = (activeDeals: Type_ActiveDeals[]) => {
    return activeDeals.map(deal => {
        const { active_safety_orders_count, max_safety_orders,
            active_manual_safety_orders, max_deal_funds, actual_usd_profit,
            actual_profit_percentage, pair, currency,
            safety_order_step_percentage, martingale_step_coefficient,
            current_price, take_profit_price,
            take_profit, base_order_volume, safety_order_volume, martingale_volume_coefficient,
            bought_volume, bought_amount, created_at, completed_safety_orders_count, completed_manual_safety_orders_count

        } = deal

        const safetyOrderString = (completed_manual_safety_orders_count > 0 || active_manual_safety_orders > 0) ? `${completed_safety_orders_count} + ${completed_manual_safety_orders_count} / ${max_safety_orders} + ${active_manual_safety_orders}` : `${completed_safety_orders_count} / ${max_safety_orders}`



        return {
            ...deal,
            actual_usd_profit,
            actual_profit_percentage,
            current_price,
            take_profit_price,
            safetyOrderString,
            max_deal_funds: parseNumber(max_deal_funds),
            pair: pair + " / " + currency,
            // the below values need to be formatted to the same length across all the data
            max_deviation: calc_deviation(max_safety_orders, safety_order_step_percentage, martingale_step_coefficient),
            in_profit: actual_usd_profit > 0,
            bot_settings: `TP: ${take_profit}, BO: ${base_order_volume}, SO: ${safety_order_volume}, SOS: ${safety_order_step_percentage}%, OS: ${martingale_volume_coefficient}, SS: ${martingale_step_coefficient}, MSTC: ${max_safety_orders}`,
            bought_volume: (bought_volume != null) ? bought_volume.toFixed(2) : 0,
            bought_amount: bought_amount + ' ' + pair,
            unrealized_profit: ( take_profit / 100 ) * bought_volume
        }
    })
}

export default formatDeals;