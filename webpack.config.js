const path = require('path');
const TeserPlugin = require('terser-webpack-plugin')
const dir_js = path.resolve(__dirname, 'src');
const dir_build = path.resolve(__dirname, 'app/assets');

const environment = process.env.env
const isProductionBuild = environment === 'prod'

const plugins = []

module.exports = {
  mode: isProductionBuild ? 'production' : 'development',
  entry: path.resolve(dir_js, 'app.js'),
  output: {
    path: dir_build,
    filename: 'bundle.js'
  },
  optimization: isProductionBuild ? {
    minimize: true,
    minimizer: [
      new TeserPlugin({extractComments: false})
    ]
  } : {},
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: plugins,
  stats: {
    colors: true
  },
  devtool: isProductionBuild ? undefined : 'source-map',
};
