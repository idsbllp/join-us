var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var Px2remWebpackPlugin = require('px2rem-webpack-plugin')
var webpackConfig = require('./webpack.config.js')

process.env.NODE_ENV = 'production';

var newWebpackConfig = merge(webpackConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
      minify: {
        // removeComments: true,
        // collapseWhitespace: true,
        // removeAttributeQuotes: true
      },
    }),
    // new Px2remWebpackPlugin({originScreenWidth: 750})
  ]
})

console.log(process.env.NODE_ENV)

webpack(newWebpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})