const fs = require('fs');

const baseOptions = {
    apis: {
        threeC: {
            key: "",
            secret: ""
        }
    },
    config: {
        defaultCurrency: "",
    },
    lastSyncTime: ""
};

function setConfig(config) {
    let setConfig;

    if (config) {
        setConfig = config
    } else {
        setConfig = baseOptions
        console.info('setting default config')
    }

    fs.writeFile('./config.json', JSON.stringify(setConfig, null, 4), function (err) {
        if (err) {
            console.log('There has been an error saving your configuration data.');
            console.log(err.message);
            return;
        }
        console.log('Configuration saved successfully.')
    });
}

async function updateConfigValues(parent, config, value) {
    let configFile = fs.readFileSync('./config.json', {encoding: 'utf8'})

    configFile = JSON.parse(configFile)

    if(parent === 'apis'){
        if(config === 'threeC'){
            if(value.key == null || value.secret == null){
                console.log('missing values')
                return 'missing values'
            }
            configFile[parent].threeC = {
                key: value.key,
                secret: value.secret
            }

        }
    }

    configFile[parent][config] = value

    setConfig(configFile)
}

const getConfigValues = () => {
    let configFile = fs.readFileSync('./config.json', {encoding: 'utf8'})
    configFile = JSON.parse(configFile)
    console.info('Fetched from the config store')
    return configFile

}
//setConfig()
//updateConfigValues('apis', 'threeC', { key: 'test', secret: 'test' })
getConfigValues()

exports.updateConfigValues = updateConfigValues;
exports.getConfigValues = getConfigValues;




