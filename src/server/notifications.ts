import { Notification } from 'electron';
import { Type_Deals_API } from '@/types/3Commas'

import { formatPercent, parseNumber } from '@/utils/number_formatting'
var path = require('path');


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
    data = data.filter(deal => deal.closed_at_iso_string > lastSyncTime)

    if (summary && data.length > 1) {
        // @ts-ignore
        const totalProfit = data.map(deal => deal.final_profit).reduce((sum, profit) => sum + profit);
        const pairs = data.map(deal => deal.pair)
        showNotification(`${data.length} Deals Closed, you're rich`, `Profit: ${parseNumber(totalProfit, 5)} - Pairs: ${pairs.join(', ')} `);

    } else {
        for (let deal of data) {
            const notificationTitle = 'Deal Closed, profit was had.';

            const { bot_name, pair, final_profit, final_profit_percentage, from_currency, id } = deal;
            const notificationString = `(${id}) ${bot_name} - ${pair} closed a deal. Profit: ${parseNumber(final_profit, 5)} ${from_currency} ( ${final_profit_percentage} % )`;
            showNotification(notificationTitle, notificationString);
        }
    }



}



export {
    showNotification,
    findAndNotifyNewDeals
}
