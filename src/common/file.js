import baseURL from '$lib/utils/baseURL';
import { Message } from 'element-ui';
import Cookies from 'js-cookie';
/**
 * params {obj} object
 * {
 *  url,
 *  method,
 *  enctype,
 *  input: {
 *      key: value,
 *      ...
 *  }
 * }
 */
export function downloadExecl(params, fn, errfn) {
    let url = baseURL() + params.url;
    let method = params.method || 'post';
    //文件上传
    if (params.type) {
        let fmData = new FormData();
        let client = new XMLHttpRequest();
        client.open(method, url, true);
        if (params.input) {
            Object.keys(params.input).forEach((k) => {
                fmData.append(k, params.input[k]);
            })
        }
        client.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 0) {
                 Message.warning('未知错误');
                if (typeof errfn == 'function') {
                    errfn(data);
                }
                return false;
            }
            let data = JSON.parse(this.responseText)
            if (this.status === 200) {
                Message.success(data.msg)
                if (typeof fn == 'function') {
                    fn(data);
                }
            } else {
                Message.warning(data.msg);
                if (typeof errfn == 'function') {
                    errfn(data);
                }
            }
        };
        client.withCredentials = true;
        client.setRequestHeader('Authorization', Cookies.get('token'));
        // console.log(Cookies.get('token'))
        client.send(fmData);
        return false;
    }
    var xhr = new XMLHttpRequest();
    let data = ''
    if (params.input) {
        Object.keys(params.input).forEach((k) => {
            data += '?' + k + '=' + params.input[k]
        })
    }
    xhr.open(method, url + data, true);    // 也可以使用POST方式，根据接口
    xhr.responseType = "blob";  // 返回类型blob
    xhr.setRequestHeader('Authorization', Cookies.get('token'));
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    xhr.onload = function () {
        // 请求完成
        if (this.status === 200) {
            // 返回200
            var blob = this.response;
            var reader = new FileReader();
            reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
            reader.onload = function (e) {
                // 转换完成，创建一个a标签用于下载
                var a = document.createElement('a');
                a.download = 'data.xlsx';
                a.href = e.target.result;
                document.body.append(a);  // 修复firefox中无法触发click
                a.click();
                document.body.removeChild(a);
            }
        }
    };
    // 发送ajax请求
    xhr.send()
    // let enctype = params.enctype || 'application/x-www-form-urlencoded';
    // // form
    // let form = document.createElement('form');
    // // iframe
    // let iframe = document.getElementById('www_iframe');
    // if (!iframe) {
    //     iframe = document.createElement('iframe');
    //     iframe.id = 'www_iframe';
    //     iframe.name = 'www_iframe';
    //     iframe.style.cssText = 'display:none';
    //     document.body.appendChild(iframe);
    // }
    // // input
    // if (params.input) {
    //     let inputBox = document.createElement('div');
    //     Object.keys(params.input).map(key => {
    //         let input = document.createElement('input');
    //         input.type = 'text';
    //         input.name = key;
    //         input.setAttribute('value', params.input[key]);
    //         inputBox.appendChild(input)
    //     })
    //     form.appendChild(inputBox);
    // }
    // // form
    // form.id = 'www_form';
    // form.name = 'www_form';
    // form.enctype = enctype;
    // form.style.display = 'none';
    // document.body.appendChild(form);
    // // form.Authorization = Cookies.get('token');
    // form.Authorization = Cookies.get('token');
    // form.method = method;
    // form.action = url;
    // form.target = iframe.name;
    // // 提交
    // form.submit();
    // document.body.removeChild(form);
}
