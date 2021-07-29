const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // NEW LINE


const PATH_SOURCE = path.join(__dirname, './src');
const PATH_DIST = path.join(__dirname, './dist');


module.exports = env => {

  const environment = env.environment;
  const isProduction = environment === 'production';
  const isDevelopment = environment === 'development';

  return {
    mode: environment,
    entry: [
      path.join(PATH_SOURCE,'./index.js')
    ],
    devtool: 'inline-source-map',
    target: 'electron-renderer',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [[
                '@babel/preset-env', {
                  targets: {
                    esmodules: true
                  }
                }],
                '@babel/preset-react']
            }
          }
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: [/\.s[ac]ss$/i, /\.css$/i],
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        }
      ]
    },
    // plugins: [
    //   // This plugin will generate an HTML5 file that imports all our Webpack
    //   // bundles using <script> tags. The file will be placed in `output.path`.
    //   // https://github.com/jantimon/html-webpack-plugin
    //   new HtmlWebpackPlugin({
    //     template: path.join(PATH_SOURCE, '/index.html'),

    //   }),
    // ],
    resolve: {
      extensions: ['.js'],
    },
    output: {
      filename: 'main-app.js',
      path: path.resolve(__dirname, PATH_SOURCE),
    },



  }
  
};