import ajax from '$lib/utils/api-factory';
import baseURL from './baseURL';
export default new ajax({
  // url: v => `http://10.1.11.62:8080/mockjs/9/iloan_admin/${v.url}`,
  // url: v => `http://10.1.16.18:8081/loanpp-admin/${v.url}`,
  url: v => baseURL()+`${v.url}`,
  optionParams: ['url'],
});
