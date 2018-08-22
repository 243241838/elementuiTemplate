import baseURL from '$lib/utils/baseURL';
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
export function downloadExecl (params) {
    let url = baseURL() + params.url;
    let method = params.method || 'post';
    let enctype = params.enctype || 'application/x-www-form-urlencoded';
    // form
    let form = document.createElement('form');
    // iframe
    let iframe = document.getElementById('www_iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'www_iframe';
        iframe.name = 'www_iframe';
        iframe.style.cssText = 'display:none';
        document.body.appendChild(iframe);
    }
    // input
    if (params.input) {
        let inputBox = document.createElement('div');        
        Object.keys(params.input).map(key => {
            let input = document.createElement('input');
            input.type = 'text';
            input.name = key;
            input.setAttribute('value', params.input[key]);
            inputBox.appendChild(input)
        })
        form.appendChild(inputBox);
    }
    // form
    form.id = 'www_form';
    form.name = 'www_form';
    form.enctype = enctype;
    form.style.display = 'none';
    document.body.appendChild(form);
    form.method = method;
    form.action = url;
    form.target = iframe.name;
    // 提交
    form.submit();
    document.body.removeChild(form);
}
