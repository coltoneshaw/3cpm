import { sub, getTime } from 'date-fns';
import dotProp from 'dot-prop';

import { TconfigValues } from '@/types/config';

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
                type: "array"
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



const defaultConfig:TconfigValues = {
    "apis": {
        "threeC": {
            "key": "",
            "secret": ""
        }
    },
    "general": {
        "defaultCurrency": [],
        "globalLimit": 250000,
        "updated" : false,
    },
    "syncStatus": {
        "deals": {
            "lastSyncTime": null,
        }
    },
    "statSettings": {
        "startDate": getTime(sub(new Date(), { days: 90 })),
        "account_id": [],
        "reservedFunds": []
    }
}

// finding the data that exists based on the dotprop.
const findConfigData = ( config:object , path:string ) => {
 
    if (dotProp.has(config, path)) return dotProp.get(config, path)
    return ""
}

export const findAccounts = ( config:object , path:string ) => {
    if (dotProp.has(config, path)){
        const definedAccounts: [] | undefined = dotProp.get(config, path)
        if(definedAccounts == null || definedAccounts.length == 0 ){
            return []
        } else {
            return definedAccounts
        }
    } 
    return ""
}


export {
    defaultConfig,
    configSchema,
    findConfigData
}
