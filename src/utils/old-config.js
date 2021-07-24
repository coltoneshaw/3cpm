const fs = require('fs');
const path = require("path");
const dotProp = require('dot-prop');
const helper = require('./helperFunctions')
//const preload = require('../../public/preload')

// use a preload path here.

const defaultConfig = {
    apis: {
        threeC: {
            key: "",
            secret: ""
        }
    },
    general: {
        defaultCurrency: "",
    },
    status: {
        deals: {
            lastSyncTime: ""
        }
    },
    database: {
        type: "local"
    }
};

class ConfigStore {
    constructor(defaults) {
        if (defaults) {
            // this is designed to reset the config
            this.all = {
                ...defaults
            }
        }

        // this is the deb path, needs to be modified when running in production.
        this._path = path.join('/','Users', 'coltonshaw', 'Library', 'Application Support', 'bot-manager','config.json');
        this._defaultConfig = defaultConfig;

    }

    // pushing an entire new config
    set all(value) {
        try {
            // console.log(value)

            if(!value) {
                console.log('this is false')
                return;
            }

            // may need to validate this is JSON coming in.
            fs.writeFile(this._path, JSON.stringify(value, null, 4), function (err) {
                if (err) {
                    console.log('There has been an error saving your configuration data.');
                    console.log(err.message);
                    return;
                }
                console.log('Configuration saved successfully.')
            });
        } catch (error) {
            throw error;
        }
    }

    get all() {
        try {
            console.info('Fetching all config')

            let data = helper.tryParseJSON_( fs.readFileSync(this._path, { encoding: 'utf8' }) )

            if(!data) return false

            return data
        } catch (error) {
            console.log('error fetching the config file or parsing')
            throw error;
        }
    }

    get(key) {
        return dotProp.get(this.all, key)
    }

    has(key) {
        return dotProp.has(this.all, key);
    }

    isDefined(key) {
        if (dotProp.has(this.all, key)) {
            return (this.get(key) != '')
        } else {
            return false;
        }

        //return ( dotProp.has(this.all, key) ) ? (this.get(key) != '') ? true : false : false;
    }

    set(key, value) {
        const config = this.all;
        if(config == false) return false

        if (arguments.length === 1) {
            for (const k of Object.keys(key)) {
                dotProp.set(config, k, key[k]);
            }
        } else {
            dotProp.set(config, key, value);
        }

        this.all = config;
        return config;

    }

    bulk(changes) {
        const config = this.all;
        if(config == false) return false

        console.log({ changes })

        for (const change of changes) {
            let { key, value } = change
            if (change.length === 1) {
                for (const k of Object.keys(key)) {
                    dotProp.set(config, k, key[k]);
                }
            } else {
                dotProp.set(config, key, value);
            }
        }

        this.all = config;
        return config;

    }

    reset() {
        this.all = this._defaultConfig
    }
}

const configStore = new ConfigStore();


exports.all = (values) => (values) ? configStore.all(values) : configStore.all;
exports.set = async (key, value) => await configStore.set(key, value);
exports.get = (key) => configStore.get(key);
exports.has = async (key) => await configStore.has(key);
exports.isDefined = async (key) => await configStore.isDefined(key);
exports.reset = async () => await configStore.reset;
exports.bulk = async (changes) => await configStore.bulk(changes)



