import Cookies from 'js-cookie';
import store from '@src/store';
import ajax from '@utils/config';
import { Message } from 'element-ui';
export default function loginout(isLoginout) {
    if (isLoginout) {
        ajax({
            url: 'auth/logout',
            optionParams: {}
        }).fetch()
            .then(res => {
                if (res.code === 200) {
                    Message({
                        message: res.msg,
                        type: 'success',
                    });
                } else {
                    Message({
                        message: res.msg,
                        type: 'warning',
                    });
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    // // token
    store.dispatch('SETUSER', { user: '' });
    store.dispatch('SETTOKEN', { token: '' });
    Cookies.remove('user');
    //Cookies.remove('token');
    window.location.reload();
}