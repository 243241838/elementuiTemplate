import _ from 'underscore';
// import Cookies from 'js-cookie';

// import {
//   setup,
// } from '$lib/utils/api-factory';

/* eslint-disable */
export let authInfo = {
  router: null,
  ids: sessionStorage.getItem('ids') || [],
};
/* eslint-enable */

export default {
  validate: router => {
    authInfo.router = router;

    router.beforeEach((to, from, next) => {
      if (authInfo.ids.length === 0) {
        if (to.path !== '/login') {
          next({
            path: '/login',
            query: {
              redirect: to.path,
            }
          })
        } else {
          next();
        }
      } 
      // else if (_.all(to.matched, v => !v.meta.noAuth)) {
      //   debugger
      //   if (authInfo.ids.indexOf(to.meta.id) < 0) {
      //     next({
      //       path: from.path,
      //       query: from.query,
      //     });
      //   } else {
      //     debugger
      //     next();
      //   }
      // } 
      else {
        next();
      }
    });
  },
  setAuth: (ids = []) => {
    authInfo.ids = ids;
    sessionStorage.setItem('ids', JSON.stringify(ids));
  },
};

// module.exports = obj;

// obj.setAuth(authInfo.uid, authInfo.token, Cookies.get('mobile'));
