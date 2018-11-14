var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
var webpack = require('webpack');
var config = require('./config');
module.exports = merge(base, {
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'crm/static/fonts/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',

                options: {
                    limit: 1000,
                    name: path.posix.join('crm', 'static/images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /.(mp3)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join('crm', 'static/music/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ //发布全局便量
            'process.env': config.dev.env
        }),
        //引入jquery(内置模块)
        // new webpack.ProvidePlugin({
        //   jQuery: "jquery",
        //   $: "jquery"
        // }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
            favicon: path.resolve('favicon.ico'),
            inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
        })
    ]
});