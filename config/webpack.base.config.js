var path = require('path');
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
        //引入jquery(内置模块)
        // new webpack.ProvidePlugin({
        //   jQuery: "jquery",
        //   $: "jquery"
        // }),
    ],
    devServer: {
        // host: '192.168.1.155',
        //  host: '192.168.1.36',
        host: 'localhost',
        port: 8086,
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