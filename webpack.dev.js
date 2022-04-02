const { merge } = require('webpack-merge');
const common = require('./webpack.common')
const webapp = require('./webpack.webapp.js');
const path = require('path');

module.exports =
  merge(common,
    webapp, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist/renderer.js')
      },
      compress: true,
      port: 9000,
    },
    optimization: {
      minimize: false,
    },
  })