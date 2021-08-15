const path = require('path');


module.exports = {
  externals: {'better-sqlite3': 'commonjs2 better-sqlite3', '3commas-api-node': 'commonjs2 3commas-api-node' },
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/preload.ts',
  target: 'electron-main',
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src'),
      ['#']: path.resolve(__dirname, '.')

    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      use: [{ loader: 'ts-loader' }]
    }]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'preload.js'
  }
}
