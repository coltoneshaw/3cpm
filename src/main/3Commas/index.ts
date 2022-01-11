import { update, run, query } from '@/main/Database/database';
import { config } from '@/main/Config/config';
import { bots, getAccountDetail, deals, getAccountSummary, getDealOrders, updateDeal } from './api';
const log = require('electron-log');
import type { defaultConfig } from '@/utils/defaultConfig';

import { findAndNotifyNewDeals } from '@/main/Notifications/notifications'


import { Type_UpdateFunction } from '@/types/3Commas'
import { Type_Profile } from '@/types/config'

/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
async function updateAPI(type: string, options: Type_UpdateFunction, profileData: Type_Profile): Promise<number | false> {

  if (!profileData) {
    log.error(' No profile was provided to the updateAPI call');
    return false
  }

  // TODO - This can probably be moved into a promise.all function
  const lastSyncTime = await getDealData(type, options, profileData)
  await getAccountData(profileData)
  await getAndStoreBotData(profileData)

  return lastSyncTime;
}

async function getDealData(type: string, options: Type_UpdateFunction, profileData: Type_Profile) {

  return await deals(options.offset, type, profileData)
    .then(data => {

      let { deals, lastSyncTime } = data

      if (deals.length === 0) return lastSyncTime;
      const store: typeof defaultConfig.globalSettings.notifications = config.get('globalSettings.notifications')
      const {enabled, summary} = store
      // if notifications need to be enabled for the fullSync then the type below needs to be updated.
      if (type === 'autoSync' && enabled && options.time != undefined || options.syncCount != 0) {
        findAndNotifyNewDeals(deals, options.time, summary)
      }

      update('deals', deals, profileData.id)

      return lastSyncTime
    })

}
async function getAccountData(profileData: Type_Profile): Promise<void> {

  if (!profileData) {
    log.error(' No profile was provided to the updateAPI call');
    return
  }

  // 1. Fetch data from the API
  await getAccountDetail(profileData)
    .then(async data => {
      // 2. Delete all the data in the database that exist in the API response
      const accountIds = data.map(account => account.account_id);
      await run(profileData.id, `DELETE FROM accountData WHERE account_id in ( ${accountIds.join()});`)
      return data
    })
    //3. Post the API response to the database.
    .then(data => update('accountData', data, profileData.id))
}


/**
 * 
 * @param profileData if not sent, this will use the current profile saved to the config.
 */
async function getAndStoreBotData(profileData: Type_Profile): Promise<void> {
  if (!profileData) {
    log.error(' No profile was provided to the updateAPI call');
    return
  }

  try {
    await bots(profileData)
      .then(async data => {
        if (data != null && data.length > 0) {

          // deleting the bots that do not exist in the sync
          // this helps to keep the database clean since bots can be removed from 3C but there is no `deleted_at` flag in the APO
          const botIDs = data.map(bot => bot.id)
          const { id } = profileData

          await run(id, `DELETE FROM bots WHERE id not in ( ${botIDs.join()});`)

          // // grabbing the existing bots
          const currentBots = await query(id, `select id, hide from bots where origin = 'sync';`)

          data = data.map(bot => {
            const current = currentBots.find(b => b.id == bot.id)
            const hide = (current != undefined) ? current.hide : false;

            return {
              ...bot,
              hide
            }
          })
          update('bots', data, id)
        }

      })
  } catch (error) {
    log.error('error getting bot data', error)
  }
}

// async function updateDeal(profileData: Type_Profile, deal: UpdateDealRequest) {
//   return await apiUpdateDeal(profileData, deal)
// }

export {
  bots,
  getAndStoreBotData,
  updateAPI,
  getAccountDetail,
  deals,
  getAccountData,
  getAccountSummary,
  getDealOrders,
  updateDeal
}