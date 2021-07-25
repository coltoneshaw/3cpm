import { sub, getTime } from 'date-fns'

const defaultConfig = {
    "apis": {
        "threeC": {
            "key": "21b6a7f20eb0448e8c642aa1a98180ca5ca6d27477484139aea5881d7ba5c034",
            "secret": "1edbe2e48e11674e0fcc53d64ae540d8fbb81314b3d3ae155d45eec48069d3be731183119eb7c54ebaedc58e038aac394de6f975cdcd74a2215fe9830c8a53fc9816679599f6efbfd23a0435549bfb41334a5c1bebb71db3d2d701accaa94360c0b33008"
        }
    },
    "general": {
        "defaultCurrency": "USD",
        "globalLimit": 250000
    },
    "syncStatus": {
        "deals": {
            "lastSyncTime": 1626958843865
        }
    },
    "database": {
        "type": "local"
    },
    "statSettings": {
        "startDate" : getTime( sub(new Date(), {days: 90})),
        "account_id" : ""
    }
}

export { defaultConfig }