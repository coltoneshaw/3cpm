// const queryString = require('query-string');

import fetch from 'electron-fetch'

const fetchVersions = async () => {


        try {
          let response = await fetch('https://portfolio-manager-3c-default-rtdb.firebaseio.com/version.json',
            {
              method: 'GET',
              timeout: 30000,
            })

          return await response.json()
        } catch (e) {
          console.log(e);
          return false
        }

}


export {
    fetchVersions
}