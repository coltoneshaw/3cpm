const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
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
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: path.resolve(__dirname, 'src'),
        use: [{ loader: 'ts-loader' }],
      },
    ]
  },
};
