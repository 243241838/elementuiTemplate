var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
var webpack = require('webpack');
var config = require('./config');
module.exports = merge(base, {
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ //发布全局便量
            'process.env': config.dev.env
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
            favicon: path.resolve('favicon.ico'),
            inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
        })
    ]
});