/**
 * This is the file responsible for updating and storing the 3 Commas information.
 */

const { bots, getAccountDetail, deals } = require('./api');
// const database = require('../database')


// const config = require('../../utils/old-config')

// console.log(config.all())
/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
// async function updateAPI(api, database, config, limit) {

//     // await deals(api, config, limit)
//     //     .then((data, database) => {
//     //         console.log('made it back here')
//     //         database.update('deals', data)
//     //     }
//     //        )

//     // const accountData = await getAccountDetail(api)
//     // await database.update('accountData', accountData)
// }


module.exports = {
    bots
}