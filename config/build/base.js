var fs = require('fs');
var path = require('path');
module.exports = function write (ip) {
    var data = getData(ip);
    var p = path.resolve(__dirname, '../../src/lib/utils/baseURL.js');
    fs.writeFile(p, data, function (err) {
        if (err) {
            throw err;
        }
        console.log('change server is successful: ' + ip);
    })
    function getData (ip) {
        return `
            export default function baseURL () {
                return ` + '"' + ip  + '"' + `
            }
        `
    }
}