const electronConfigs = require('./webpack.electron.js');
const preloadConfig = require('./webpack.preload.js');

const reactConfigs = require('./webpack.react.js');

module.exports = [
  electronConfigs,
  preloadConfig,
  reactConfigs
];
