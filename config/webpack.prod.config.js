var path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); // css分离
var webpack = require('webpack')

module.exports = merge(base, {
  module: {
    rules: [
      {
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
      //分离css  但是修改less文件时，报错，需重启
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader", //编译后用什么loader来提取css文件
          use: [ //指需要什么样的loader去编译文件,
            "css-loader",
            "less-loader"
          ],
          // publicPath: '', //用来覆盖项目路径,生成该css文件的文件路径
        })
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
  }
});

