var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: {
        prospect: path.resolve(__dirname, '../prospect.js'),
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
            // {
            //     test: /\.(png|jpe?g|gif|svg)$/,
            //     loader: 'url-loader',
            //     query: {
            //         limit: 10000,
            //         name: './dist/[name].[ext]'
            //     }
            // },
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
