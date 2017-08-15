var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpackConfig = require('./webpack.config.js')

var newWebpackConfig = merge(webpackConfig, {
    devtool: '#eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
          filename: 'app.html',
          template: 'index.html',
          inject: true
        }),
    ]
})

webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})