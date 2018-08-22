let base = require('./base');
var argument = process.argv.splice(2);

if (argument[0] === 'devServer') {
    base('http://192.168.0.13:8055/zrf_admin/'); //开发启动
} else if (argument[0] === 'testServer') {
    base('http://192.168.0.13:8055/zrf_admin/'); //开发测试打包
} else if (argument[0] === 'chengmei') {
    base('http://192.168.1.82:8055/') //成美打包
} else if (argument[0] === 'production') {
    base('https://zrf.zhaogu168.com/'); //生产打包
} else if (argument[0] === 'agency') {
    base('/kxd-admin/'); //代理
}

//  打包命令 npm run 'argument[0]'  dist文件下所有

// export function baseURL() {
/* development */

// return '/kxd-admin/' // 王美昕
// return '/kxd-admin/' // 张永平
// return '/kxd-admin/' // 俊哥
// return '/kxd-admin/' // 测试服务器
// return '/kxd-admin-server/' // 开发服务器

// ------------------------------------------------- //
/* production */

// }
// return "http://192.168.0.13:8055/zrf_admin/" //开发
// return 'https://zrf.zhaogu168.com/' //生产 http://139.199.163.109:8066/
// return "http://192.168.1.106:8055/zrf_admin/" //   成美
// return 'http://192.168.1.121:8055/zrf_admin/' //德哥 
// return "http://192.168.1.75:8055/zrf_admin/" //徐涛
// return "http://192.168.1.79:8066/" //谢静艳
// return "/lifeservice/" //开发