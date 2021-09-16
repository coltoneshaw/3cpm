import { update, run, query } from '@/app/Features/Database/database';
const { bots, getAccountDetail, deals, getAccountSummary } = require('./api');
const { getProfileConfigAll } = require('@/utils/config')
import { findAndNotifyNewDeals } from '@/app/Features/Notifications/notifications'

import { Type_Deals_API, Type_Query_Accounts, Type_API_bots, Type_UpdateFunction } from '@/types/3Commas'
import { Type_Profile } from '@/types/config'

/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
async function updateAPI(type: string, options: Type_UpdateFunction, profileData: Type_Profile) {
  if (!profileData) {
    profileData = getProfileConfigAll()
  }

  await deals(options.offset, type, profileData)
    .then((data: Type_Deals_API[]) => {

      // if notifications need to be enabled for the fullSync then the type below needs to be updated.
      if (type === 'autoSync' && options.notifications && options.time != undefined) findAndNotifyNewDeals(data, options.time, options.summary)
      update('deals', data, profileData.id)
      // console.log(data)
    })

  // if (type !== 'autoSync' || options.syncCount === 20) {
  //   console.log('updating the accounts!')
    await getAccountData(profileData)
  // }

}

async function getAccountData(profileData: Type_Profile) {

  if (!profileData) {
    profileData = getProfileConfigAll()
  }

  // 1. Fetch data from the API
  await getAccountDetail(profileData)
    .then(async (data: Type_Query_Accounts[]) => {
      // 2. Delete all the data in the database that exist in the API response
      const accountIds = data.map(account => account.account_id);
      await run(`DELETE FROM accountData WHERE account_id in ( ${accountIds.join()}) and profile_id='${profileData.id}';`)
      return data
    })
    //3. Post the API response to the database.
    .then((data: Type_Query_Accounts[]) => update('accountData', data, profileData.id))
}


/**
 * 
 * @param profileData if not sent, this will use the current profile saved to the config.
 */
async function getAndStoreBotData(profileData: Type_Profile) {

  if (!profileData) {
    profileData = getProfileConfigAll()
  }
  try {
    await bots(profileData)
      .then(async (data: Type_API_bots[]) => {
        if (data != null && data.length > 0) {


          // deleting the bots that do not exist in the sync
          // this helps to keep the database clean since bots can be removed from 3C but there is no `deleted_at` flag in the APO
          const botIDs = data.map(bot => bot.id)
          const { id } = profileData

          await run(`DELETE FROM bots WHERE id not in ( ${botIDs.join()}) and profile_id = '${id}' ;`)

          // // grabbing the existing bots
          const currentBots = await query(`select id, hide from bots where origin = 'sync' and profile_id = '${id}';`)

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
    console.error('error getting bot data', error)
  }

}

export {
  bots,
  getAndStoreBotData,
  updateAPI,
  getAccountDetail,
  deals,
  getAccountData,
  getAccountSummary
}