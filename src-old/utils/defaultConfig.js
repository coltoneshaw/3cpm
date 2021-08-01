const { sub, getTime } = require('date-fns');

const configSchema = {
    apis: {
        type: "object",
        properties: {
            threeC: {
                type: "object",
                properties: {
                    key: {
                        type: ["string", "null"],
                        default: ""
                    },
                    secret: {
                        type: ["string", "null"],
                        default: ""
                    }
                }
            }
        }
    },
    general: {
        type: "object",
        properties: {
            defaultCurrency: {
                type: "string",
                default: "USD"
            },
            globalLimit: {
                type: "number",
                default: 250000
            }
        }
    },
    syncStatus: {
        type: "object",
        properties: {
            deals: {
                type: "object",
                properties: {
                    "lastSyncTime": {
                        type: ["number", "null"],
                        minimum: 0
                    }
                } 
            }
        }  
    },
    statSettings: {
        type: "object",
        properties: {
            startDate: {
                type: "number",
                default: "",
            },
            account_id: {
                type: ["array"],

            }
        }
    }
}


const defaultConfig = {
    "apis": {
        "threeC": {
            "key": "",
            "secret": ""
        }
    },
    "general": {
        "defaultCurrency": "USD",
        "globalLimit": 250000
    },
    "syncStatus": {
        "deals": {
            "lastSyncTime": null,
        }
    },
    "statSettings": {
        "startDate": getTime(sub(new Date(), { days: 90 })),
        "account_id": [],
    }
}

// version is the existing version of the application.
const migrations = {
    '0.0.3': store =>{
        console.info('migrating the config store to 0.0.2-RC1')
        store.set('statSettings.account_id', []);
    }
}

exports.defaultConfig = defaultConfig;
exports.configSchema = configSchema;
exports.migrations = migrations