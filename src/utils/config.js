const Store = require('electron-store');

const { defaultConfig, configSchema } = require('./defaultConfig')

// establishing a config store.
const config = new Store({
    defaults: defaultConfig, 
    schema: configSchema
});

exports.config = config;