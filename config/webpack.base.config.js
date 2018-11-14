var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); // css分离
const cleanWepackPlugin = require('clean-webpack-plugin');

var webpack = require('webpack')

var config = require('./config');

module.exports = {
     entry: {
          app: ['babel-polyfill', path.resolve(__dirname, '../src/index.js')]
     },
     output: {
          path: path.resolve(__dirname, '../dist'),
          //编译生成的js文件存放到根目录下面的js目录下面,如果js目录不存在则自动创建
          filename: 'crm/static/js/[name].[chunkhash].js',
          //用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
          chunkFilename: 'crm/static/js/chunks/[id].[chunkhash].js',
          publicPath: ''
     },
     resolve: {
          //配置默认扩展名 默认值是[“”, “.webpack.js”, “.web.js”, “.js”]
          extensions: ['.js', '.json', '.vue'],
          alias: {
               'vue': 'vue/dist/vue.js',
               '@res': path.resolve(__dirname, 'res'),
               '@src': path.resolve(__dirname, '../src'),
               '$lib': path.resolve(__dirname, '../src/lib'),
               '@views': path.resolve(__dirname, '../src/views'),
               '@utils': path.resolve(__dirname, '../src/lib/utils'),
               '@filters': path.resolve(__dirname, '../src/filters'),
               '@constants': path.resolve(__dirname, '../src/constants'),
               '@common': path.resolve(__dirname, '../src/common'),
          }
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
     ],
     devServer: {
          host: '192.168.1.155',
          //  host: '192.168.1.36',
          // host: 'localhost',
          port: 8087,
          disableHostCheck: true,
          proxy: { //代理
               '/kxd-admin': {
                    target: 'http://139.199.163.109:8066/',
                    pathRewrite: {
                         '^/kxd-admin': ''
                    }
               }
          }
     }
}