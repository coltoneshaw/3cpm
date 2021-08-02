const { mainConfig,
  preloadconfig 
} = require('./webpack.electron.js');

const reactConfigs = require('./webpack.react.js');

module.exports = [
  mainConfig,
  preloadconfig,
  reactConfigs
];
