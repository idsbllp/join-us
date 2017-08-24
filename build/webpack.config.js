var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: {
        prospect: path.resolve(__dirname, '../src/prospect.js'),
        app: path.resolve(__dirname, '../src/index.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: 'js/[name].js',
        publicPath:  process.env.NODE_ENV === 'production' ? './' : '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[ext]'
                }
            },
            {
                test: /\.less$/,
                use:  ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader', 'postcss-loader'],
                    publicPath: process.env.NODE_ENV === 'production' ? '../' : '/'
                })
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'mp3/[name].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'font/[name].[ext]'
                }
            },
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("./styles/index.css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [precss, autoprefixer];
                },
                devServer: {
                    contentBase: "../",
                    colors: true,
                    historyApiFallback: true,
                    inline: true
                }
            }
        })
    ],
}
