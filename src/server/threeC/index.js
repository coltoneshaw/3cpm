/**
 * This is the file responsible for updating and storing the 3 Commas information.
 */

const api = require('./api');
const database = require('../database')




/**
 * 
 * TODO
 * - Inspect if the lastSyncTime is set. If it is, then need to run bulk. If it's not, need to run update. This might need to go into
 * the code for threeC
 */
async function update() {

    await api.deals()
        .then(data => database.update('deals', data))

    await api.getAccountDetail()
        .then(data => database.update('accountData', data))
}


exports.update = update