import { update, run, query } from '@/app/Features/Database/database';
const { bots, getAccountDetail, deals, getDealsBulk, getAccountSummary } = require('./api');

import { findAndNotifyNewDeals } from '@/app/Features/Notifications/notifications'

import { Type_Deals_API, Type_Query_Accounts, Type_API_bots, Type_UpdateFunction } from '@/types/3Commas'

/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
async function updateAPI(type: string, options:Type_UpdateFunction ) {


  await deals(options.offset, type)
    .then((data: Type_Deals_API[]) => {

      // if notifications need to be enabled for the fullSync then the type below needs to be updated.
      if(type ==='autoSync' &&options.notifications && options.time != undefined ) findAndNotifyNewDeals( data, options.time , options.summary )
      update('deals', data)
      // console.log(data)
    })

    if(type !== 'autoSync' || options.syncCount === 20){
      console.log('updating the accounts!')
      await getAccountData()
    }
  
}

async function getAccountData() {

  // 1. Fetch data from the API
  await getAccountDetail()
    .then(async (data: Type_Query_Accounts[]) => {
      // 2. Delete all the data in the database that exist in the API response
      const accountIds = data.map(account => account.account_id);
      await run(`DELETE FROM accountData WHERE account_id in ( ${accountIds.join()});`)
      return data
    })
    //3. Post the API response to the database.
    .then((data: Type_Query_Accounts[]) => update('accountData', data))
}

async function getAndStoreBotData() {
  try {
    await bots()
      .then(async (data: Type_API_bots[]) => {
        if (data != null && data.length > 0) {

          // deleting the bots that do not exist in the sync
          // this helps to keep the database clean since bots can be removed from 3C but there is no `deleted_at` flag in the APO
          const botIDs = data.map(account => account.id)
          await run(`DELETE FROM bots WHERE id not in ( ${botIDs.join()});`)

          // // grabbing the existing bots
          const currentBots = await query("select id, hide from bots where origin = 'sync'")

          data = data.map( bot => {
            const current = currentBots.find( b => b.id == bot.id)
            const hide = (current != undefined) ? current.hide : false;
            return {
              ...bot,
              hide
            }
          })

          update('bots', data)
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
  getDealsBulk,
  getAccountData,
  getAccountSummary
}