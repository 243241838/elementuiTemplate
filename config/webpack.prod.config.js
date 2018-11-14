var path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');

var HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWepackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); // css分离
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    },
    plugins: [
        // 这里是之前配置的其它各种插件
        new cleanWepackPlugin( //先清空dist
            ['dist'], {
                root: path.resolve(__dirname, '../'), //根目录
                verbose: true, //开启在控制台输出信息
                dry: false //启用删除文件
            }
        ),
        new webpack.DefinePlugin({ //发布全局便量
            'process.env': config.dev.env
        }),
        //引入jquery(内置模块)
        // new webpack.ProvidePlugin({
        //   jQuery: "jquery",
        //   $: "jquery"
        // }),
        //css分离
        // new ExtractTextPlugin(path.posix.join('crm', 'static/css/[name].[contenthash].css')),
        new ExtractTextPlugin({
            filename: 'crm/static/css/[name].[contenthash].css',
            allChunks: true,
        }),
        new OptimizeCSSPlugin({ //生成html的插件,引入css文件和js文件
            cssProcessorOptions: true ? {
                safe: true,
                map: {
                    inline: false
                }
            } : {
                safe: true
            }
        }),
        new UglifyJsPlugin({ //js文件压缩插件
            uglifyOptions: {
                compress: { //压缩配置
                    warnings: false, // 不显示警告
                    // dead_code: true, //移除没被引用的代码
                    drop_debugger: true, //移除 debugger;
                    drop_console: true, //不显示conlog
                    // passes: 1 //默认1  其他大于1， 越大压缩时间越长
                }
            },
            sourceMap: true, //生成sourceMap文件
            parallel: true
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
            favicon: path.resolve('favicon.ico'),
            inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
            minify: { //压缩配置
                removeComments: true, //删除html中的注释代码
                collapseWhitespace: true, //删除html中的空白符
                removeAttributeQuotes: true //删除html元素中属性的引号
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            chunksSortMode: 'dependency' //按dependency的顺序引入
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ //分离公共js到vendor中
            name: 'vendor', //文件名
            minChunks(module) { // 声明公共的模块来自node_modules文件夹
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({ //压缩
            name: 'app',
            async: 'vendor-async', //目标文件名
            children: true,
            minChunks: 3
        }),
    ]
});