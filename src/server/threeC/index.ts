import { update, run } from '@/server/database';
const { bots, getAccountDetail, deals, getDealsBulk, getDealsUpdate, getAccountSummary } = require('./api');

import { findAndNotifyNewDeals } from '@/server/notifications'

import { Type_Deals_API, Type_Query_Accounts, Type_API_bots, Type_UpdateFunction } from '@/types/3Commas'

/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
async function updateAPI(type: string, options:Type_UpdateFunction ) {


  await deals(options.offset)
    .then((data: Type_Deals_API[]) => {

      if( type == 'autoSync' && options.notifications && options.time != undefined ) findAndNotifyNewDeals( data, options.time , options.summary )
      update('deals', data)
    })

    if(type !== 'autoSync'){
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

          const botIDs = data.map(account => account.id)
          await run(`DELETE FROM bots WHERE id not in ( ${botIDs.join()});`)

          update('bots', data)
        }

      })
  } catch (error) {
    console.log(error)
    console.log('error getting bot data')
  }

}

export {
  bots,
  getAndStoreBotData,
  updateAPI,
  getAccountDetail,
  deals,
  getDealsBulk,
  getDealsUpdate,
  getAccountData,
  getAccountSummary
}