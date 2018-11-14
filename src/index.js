import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as filters from './filters/index.js'
// import echarts from 'echarts';
import echarts from 'echarts';
// 赋值到Vue的原型上面，在页面就可以使用this.$echarts获取到了
// Vue.prototype.$echarts = echarts;
//全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
import store from '@src/store';
import App from './index.vue';
import main from './main.vue';
import login from './login.vue';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import Cookies from 'js-cookie';
import ajax from '@utils/config';
Vue.use(VCharts)
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);



// 路由
import jurisdiction from '@views/jurisdiction'; //权限

// 路由结束
const defaultRoute = {
    path: '/',
    component: App,
    meta: {
        id: '100000',
    },
    children: [
        jurisdiction
    ]
};
const routes = [{
        path: '/login',
        name: '登录',
        hidden: true,
        component: login
    },
    {
        path: '/',
        redirect: '/login'
    },
    defaultRoute,
];

export default routes;


const router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes
})

let toHome = false;
//全局钩子作用于所有路由，里面的参数to表示即将要进入的路由对象，from表示即将要离开的路由对象 路由进入之前
router.beforeEach((to, from, next) => {
    // 开启Progress
    NProgress.start();
    //重定向到login时
    if (from.path === '/' && to.path === '/login') {
        if (store.getters.token && !store.getters.user) {
            toHome = true;
        }

    }
    //登录且有用户信息
    if (store.getters.user) {
        if (!to.name) {
            // 404
            console.log(11112);
        }
        if (to.path === '/login') {
            console.log(11111);
            next();

        } else {
            // headerSelected(to, vm);
            // detailLink(to);
            console.log(11113);
            next();
        }
    } else if (!store.getters.user && Cookies.get('user')) {
        // 登录且没有用户信息
        console.log(11114);
        next();
    } else if (to.path === '/login') {
        console.log(11115);
        // 未登录
        next();
    } else {
        next('/login');
        console.log(11116);
    }
    next();
    NProgress.done();
});
// //路由进入之后
router.afterEach((to, from) => {
    NProgress.done(); // 结束Progress
});
new Vue({
    el: '#app',
    store,
    router,
    template: '<App />',
    components: { App },
    mounted() {

    }
});