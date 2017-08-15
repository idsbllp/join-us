var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

console.log(process.env.NODE_ENV)

module.exports = {
    entry: {
        app: path.resolve(__dirname, '../index.js')
    },
    output: {
        path: path.resolve(__dirname, '../js/'),
        filename: '[name].js',
        publicPath:  process.env.NODE_ENV === 'production' ? './js' : '/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
       }),
       // new HtmlWebpackPlugin({
       //    filename: '../app.html',
       //    template: 'index.html',
       //    inject: true
       //  }),
    ],
}
