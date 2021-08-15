import { Notification } from 'electron';
import { Type_Deals_API } from '@/types/3Commas'

import { formatPercent, parseNumber } from '@/utils/number_formatting'
var path = require('path');

// This is added to prevent duplicate notifications from happening when the computer is asleep
let dealsNotified: number[] = []

function showNotification(title: string, body: string) {

    const options = {
        title,
        body,
        icon: path.join('./256x256.png')
    }
    new Notification(options).show()
}

/**
 * 
 * @param data this is the recent synced string of data
 * @param lastSyncTime This is the miliseconds of the last sync.
 * @param summary boolean value to represent if notifications are summarized if multiple come in together.
 */
function findAndNotifyNewDeals(data: Type_Deals_API[], lastSyncTime: number, summary?: boolean) {

    // filter for only deals that have closed
    // this will filter based on the ISO string of the closed at and if it's greater than
    // the last sync time. If so, it means it's a newly closed deal.
    // Additionally this filters out any deals it's already notified of

    // remove deals that closed before the last sync and that have already been notified.
    data = data.filter(deal => deal.closed_at_iso_string > lastSyncTime && !dealsNotified.includes(deal.id))

    console.log(dealsNotified)

    // end the function if no deals exist in the filtered array
    if(data.length === 0) return false

    // if summary enabled and more than one deal exists.
    if (summary && data.length > 1) {
        // @ts-ignore
        const totalProfit = data.map(deal => deal.final_profit).reduce((sum, profit) => sum + profit);
        const pairs = data.map(deal => deal.pair)
        const moneyBags = ( "💰".repeat(data.length))
        try {

            showNotification(`${data.length} Deals Closed, you're rich`, `Profit: ${parseNumber(totalProfit, 5)} - Pairs: ${pairs.join(', ')}. ${moneyBags} `);

            // add the deal IDs to the notified deal array
            dealsNotified.push( ...data.map(deal => deal.id) )
        } catch (error){
            console.error('error showing notification - ' + error)
        }

    } else {
        for (let deal of data) {
            const notificationTitle = 'Deal Closed, profit was had.';

            const { bot_name, pair, final_profit, final_profit_percentage, from_currency, id } = deal;
            const moneyBags = ( "💰".repeat(Math.round(final_profit_percentage)))
            const notificationString = `(${id}) ${bot_name} - ${pair} closed a deal. Profit: ${parseNumber(final_profit, 5)} ${from_currency} ( ${final_profit_percentage} % ). ${moneyBags}`;

            try {
                showNotification(notificationTitle, notificationString);

                // add the single deal ID to the notified array.
                dealsNotified.push( id )
            }  catch (error){
                console.error('error showing notification - ' + error)
            }
        }
    }

}



export {
    showNotification,
    findAndNotifyNewDeals
}
