var path = require('path')
var webpack = require('webpack')

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
            },
            {
               test: /\.(jpe?g|png|gif|)$/i,
               loader: 'file!tinypng'
            },
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
}
