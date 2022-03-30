const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/webapp/renderer.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist/renderer.js'),
    compress: true,
    port: 9000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, '.'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              '@babel/preset-env', {
                targets: {
                  esmodules: true,
                },
              }],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'renderer.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
