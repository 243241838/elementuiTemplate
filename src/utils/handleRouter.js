import Cookies from 'js-cookie';
import store from '@src/store';
export default function handleRouter (routers, isLogin) {
    return new Promise (resolve => {
        let headerRouters = [];
        let addRoutes = [];
        routers.map(item => {
            let resourceName = item.resourceName;
            //
            item.subMenuList.map((sItem, sIndex) => {
                let obj = {
                    path: '/' + sItem.resourceUrl,
                    component: layout[sItem.resourceUrl],
                    meta: {
                        title: sItem.resourceName
                    },
                    children: []
                }
                sItem.subMenuList.map((tItem, tIndex) => {
                    let inner = {
                        path: tItem.resourceUrl,
                        component: modules[tItem.resourceUrl],
                        meta: {
                            title: tItem.resourceName
                        },
                        name: sItem.resourceUrl + '_' + tItem.resourceUrl
                    }
                    obj.children.push(inner);
                    // if (sIndex == 0 && tIndex == 0) {
                    //     let resourceUrl = '/' + sItem.resourceUrl + '/' + tItem.resourceUrl;
                    //     headerRouters.push({resourceName, resourceUrl})
                    // }
                })
                addRoutes.push(obj);
            })
        })
        // 侧边栏路由
        // store.dispatch('ADDROUTERS', {addRoutes}).then(() => {
        //     router.addRoutes(store.getters.addRoutes);
        //     if (isLogin) {
        //         // router.push({path: '/homePage/index'});
        //         router.push({path: store.getters.headerRouters[0].resourceUrl});
        //     }
        // })
        resolve();
    });
};
