const path = require('path');
const webpack = require('webpack');
const dir_js = path.resolve(__dirname, 'src');
const dir_build = path.resolve(__dirname, 'app/assets');

const environment = process.env.env
const isProductionBuild = environment === 'prod'

const plugins = []

plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': isProductionBuild ? JSON.stringify('production') : JSON.stringify('dev')
  }
}))

if (isProductionBuild) {
  plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = {
  entry: path.resolve(dir_js, 'app.js'),
  output: {
    path: dir_build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: dir_js,
        query: {
          plugins: ['transform-decorators-legacy', 'transform-object-rest-spread'],
          presets: ['es2015', 'react'],
        },
      }
    ]
  },
  plugins: plugins,
  stats: {
    colors: true
  },
  devtool: isProductionBuild ? undefined : 'source-map',
};
