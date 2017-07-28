/**
 * @file 后台默认管理员账号，密码采用md5加密
 * @author littlewin(littlewin.wang@gmail.com)
 */

const md5 = require('md5')

module.exports = {
	name: 'littlewin',
	password: md5('admin')
}
