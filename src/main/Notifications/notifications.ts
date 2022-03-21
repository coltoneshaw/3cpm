/* eslint-disable @typescript-eslint/naming-convention */
import { Notification } from 'electron';

import path from 'path';
import { parseNumber } from '@/utils/numberFormatting';
import { getProfileConfig } from '@/main/Config/config';
import { ReservedFundsType } from '@/types/config';

import { convertMiliseconds } from '@/utils/helperFunctions';

import { PreStorageDeals3cAPI } from '@/types/3CommasAPI/Deals';

const accountFilters = () => {
  const profileConfig: ReservedFundsType[] = getProfileConfig(
    'statSettings.reservedFunds',
  );
  return profileConfig
    .filter((account) => account.is_enabled).map((account) => account.id);
};

// This is added to prevent duplicate notifications from happening when the computer is asleep
const dealsNotified: number[] = [];

function showNotification(title: string, body: string) {
  const options = {
    title,
    body,
    icon: path.join('./256x256.png'),
  };
  new Notification(options).show();
}

const calcDealTime = (created_at: string, closed_at: string) => {
  const createdAtMiliseconds = new Date(created_at).getTime();
  const closedAtMiliseconds = new Date(closed_at).getTime();
  const dateObj = convertMiliseconds(
    closedAtMiliseconds - createdAtMiliseconds,
  );

  const {
    d, h, m, s,
  } = dateObj;
  let timeString = s;
  let type = 'second';

  if (d > 0) {
    const hours = (h > 0) ? h / 24 : 0;
    timeString = d + hours;
    type = 'day';
  } else if (h > 0) {
    const minutes = (m > 0) ? m / 60 : 0;
    timeString = h + minutes;
    type = 'hour';
  } else if (m > 0) {
    const seconds = (s > 0) ? s / 60 : 0;
    timeString = m + seconds;
    type = 'minute';
  }

  if (timeString === 0) {
    return '';
  }

  return `about ${Math.round(timeString)} ${type}${timeString > 1 ? 's' : ''}.`;
};

/**
 *  d
 * @param data this is the recent synced string of data
 * @param lastSyncTime This is the miliseconds of the last sync.
 * @param summary boolean value to represent if notifications are summarized if multiple come in together.
 */

function findAndNotifyNewDeals(
  data: PreStorageDeals3cAPI[],
  lastSyncTime: number,
  summary: boolean,
) {
  const filters = accountFilters();

  // filter for only deals that have closed
  // this will filter based on the ISO string of the closed at and if it's greater than
  // the last sync time. If so, it means it's a newly closed deal.
  // Additionally this filters out any deals it's already notified of

  // remove deals that closed before the last sync and that have already been notified.
  const closedDeals = data.filter((deal) => deal.closed_at_iso_string != null
    && deal.closed_at_iso_string > lastSyncTime
    && !dealsNotified.includes(deal.id) && filters.includes(deal.account_id));

  // end the function if no deals exist in the filtered array
  if (closedDeals.length === 0 || !lastSyncTime) return;

  // if summary enabled and more than one deal exists.
  if (summary && closedDeals.length > 1) {
    const totalProfit = closedDeals
      .map((deal) => Number(deal.final_profit))
      .reduce((sum, profit) => sum + profit);

    const pairs = closedDeals.map((deal) => deal.pair);
    const moneyBags = ('💰'.repeat(closedDeals.length));
    const ifRich = (+totalProfit > 0) ? 'rich' : 'poor';
    const profit = parseNumber(totalProfit, 5);
    const pairList = pairs.join(', ');
    try {
      showNotification(
        `${closedDeals.length} Deals Closed, you're ${ifRich}`,
        `Profit: ${profit} - Pairs: ${pairList}. ${moneyBags} `,
      );

      // add the deal IDs to the notified deal array
      dealsNotified.push(...closedDeals.map((deal) => deal.id));
    } catch (error) {
      console.error(`error showing notification - ${error}`);
    }
    return;
  }

  closedDeals.forEach((deal) => {
    const {
      bot_name, pair, final_profit,
      final_profit_percentage, from_currency, id,
      created_at, closed_at,
    } = deal;
    const ifRich = (+final_profit > 0) ? 'had' : 'lost';
    const notificationTitle = `Deal Closed, profit was ${ifRich}.`;

    // deal length:

    // calculate difference in miliseconds between created_at and closed_at
    // decide if it's days / hours / minutes / seconds
    // add to end of string
    const moneyBags = (+final_profit_percentage > 0)
      ? '💰'.repeat(Math.abs(Math.round(+final_profit_percentage)))
      : '';
    // eslint-disable-next-line max-len
    const notificationString = `(${id}) ${bot_name} - ${pair} closed a deal. Profit: ${parseNumber(final_profit, 5)} ${from_currency} ( ${final_profit_percentage} % ) ${calcDealTime(created_at, closed_at)}${moneyBags}`;

    try {
      showNotification(notificationTitle, notificationString);

      // add the single deal ID to the notified array.
      dealsNotified.push(id);
    } catch (error) {
      console.error(`error showing notification - ${error}`);
    }
  });
}

export {
  showNotification,
  findAndNotifyNewDeals,
};
