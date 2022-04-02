const { merge } = require('webpack-merge');
const common = require('./webpack.common')
const webapp = require('./webpack.webapp.js');
const electron = require('./webpack.electron');

const productionObject = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
  },
}

module.exports = [
  merge(electron, productionObject),
  merge(common, webapp, productionObject)
]