import { Message } from 'element-ui';
var Common = {};
//获取N天之前或之后的日期
Common.getAgoDate = (AddDayCount) => {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    m = m < 10 ? ('0' + m) : m;
    var d = dd.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}
//正整数
// obj  传递的参数
// let obj = {
//     input: e,  $event
//     maxMoney: 200000, 限制大小  
//     that: this  vue 
// }
Common.positiveIntegerMoney = (obj) => {
    let input = obj.input.srcElement ? obj.input.srcElement : obj.input.target;
    if (input.value.length == 1) {
        input.value = input.value.replace(/[^1-9]/g, '')
    } else {
        input.value = input.value.replace(/\D/g, '')
    }
    //如果有小小金钱大小限制，传入money
    if (obj.maxMoney) {
        if (input.value > obj.maxMoney) {
            input.value = '';
            Message({
                message: '不能大于' + obj.maxMoney,
                type: 'warning',
            });
        }
    }
    // console.log(input.value)
    return input.value;
}
//可输0
Common.positiveIntegerMoney1 = (obj) => {
    let input = obj.input.srcElement ? obj.input.srcElement : obj.input.target;
    if (input.value.length == 1) {
        input.value = input.value.replace(/[^0-9]/g, '')
    } else {
        input.value = input.value.replace(/\D/g, '')
    }
    //如果有小小金钱大小限制，传入money
    if (obj.maxMoney) {
        if (input.value > obj.maxMoney) {
            input.value = '';
            Message({
                message: '不能大于' + obj.maxMoney,
                type: 'warning',
            });
        }
    }
    // console.log(input.value)
    return input.value;
}
//两位小数
Common.twoDecimalPlaces = (obj) => {
    console.log('a')
    // obje: e,  firstName，  twoName，  that
    let input = obj.e.srcElement ? obj.e.srcElement : obj.e.target;
    input.value = input.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    // //首位不能为.
    if (input.value !== '' && input.value === '.') {
        input.value = '';
    }
    // //以上已经过滤,此处控制的是如果没有小数点,首位不能为类似于01,02的金额
    if (input.value.indexOf('.') < 0 && input.value !== '') {
        if (input.value.length === 2) {
            input.value = parseFloat(input.value)
        }
        //第一位不能为.
        if (input.value === '.') {
            input.value = ''
        }
    }
    if (obj.twoName) {
        obj.that[obj.firstName][obj.twoName] = input.value;
    } else {
        obj.that[obj.firstName] = input.value;
    }
}
//数组排序
Common.compare = (property, positiveSequence) => {
    return function (a, b) {
        var value1 = '';
        var value2 = '';
        if (property) {
            value1 = a[property];
            value2 = b[property];
        } else {
            value1 = a;
            value2 = b;
        }
        if (positiveSequence) { //正序
            return value1 - value2;
        } else { //倒叙
            return value2 - value1;
        }
    }
}
export {
    Common
}



