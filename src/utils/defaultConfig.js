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
                type: ["number","null"],

            }
        }
    }
}


const defaultConfig = {
    "apis": {
        "threeC": {
            "key": null,
            "secret": null
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
        "account_id": null,
    }
}

exports.defaultConfig = defaultConfig;
exports.configSchema = configSchema;