const path = require('path');

module.exports = {
  externals: { 'better-sqlite3': 'commonjs2 better-sqlite3' },
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/main/main.ts',
  target: 'electron-main',
  optimization: {
    minimize: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, '.'),
    },
    extensions: ['.tsx', '.ts', '.js'],
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
    filename: 'main.js',
  },
};
