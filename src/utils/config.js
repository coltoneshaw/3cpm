const Store = require('electron-store');

const { defaultConfig, configSchema, migrations } = require('./defaultConfig')

// establishing a config store.
const config = new Store({
    migrations,
    defaults: defaultConfig});

exports.config = config;