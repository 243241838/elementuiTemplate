import Template from '@src/template';
import userGroup from './userGroup'; //用户组
import user from './user'; //用户
import greetPage from './greetPage';
module.exports = {
    path: '/jurisdiction',
    component: Template,
    meta: {
        title: '权限'
    },
    children: [
        {
            path: 'userGroup',
            name: 'jurisdiction_userGroup',
            component: userGroup,
            meta: {
                title: '用户组'
            }
        },
        {
            path: 'user',
            name: 'jurisdiction_user',
            component: user,
            meta: {
                title: '用户'
            }
        },
        {
            path: 'greetPage',
            name: 'jurisdiction_greetPage',
            component: greetPage,
            meta: {
                title: '欢迎进入'
            },
        }
    ]
}