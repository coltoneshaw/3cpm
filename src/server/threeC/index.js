/**
 * This is the file responsible for updating and storing the 3 Commas information.
 */

const { bots, getAccountDetail, deals } = require('./api');
//const database = require('../database')


const config = require('../../utils/old-config')

console.log(config.all())
/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
async function update() {

    await deals()
        .then(data => database.update('deals', data))

    await getAccountDetail()
        .then(data => database.update('accountData', data))
}


module.exports = {
    update,
    bots
}