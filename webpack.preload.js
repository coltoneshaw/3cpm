const path = require('path');

module.exports = {
  externals: { 'better-sqlite3': 'commonjs2 better-sqlite3', '3commas-api-node': 'commonjs2 3commas-api-node' },
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/electron/preload.ts',
  target: 'electron-main',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, '.'),
      'webapp': path.resolve(__dirname, 'src/webapp'),
      'electron': path.resolve(__dirname, 'src/electron'),
      'common': path.resolve(__dirname, 'src/common'),
      'types': path.resolve(__dirname, 'src/types'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      use: [{ loader: 'ts-loader' }],
    }],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'preload.js',
  },
};
