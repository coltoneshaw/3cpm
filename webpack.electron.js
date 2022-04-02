const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common')

module.exports = merge(common, {
  externals: {
    'better-sqlite3': 'commonjs2 better-sqlite3',
    '3commas-api-node': 'commonjs2 3commas-api-node'
  },
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: {
    'main': './src/electron/main/main.ts',
    'preload': './src/electron/preload.ts'
  },
  target: 'electron-main',
  optimization: {
    minimize: false,
  },

});
