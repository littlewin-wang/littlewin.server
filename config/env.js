/**
 * @file 项目配置文件
 * @author littlewin(littlewin.wang@gmail.com)
 *
 * @AUTH 默认账户
 * @mongo && port  数据库连接配置
 * @QINIU 七牛密钥
 * @QCLOUD 腾讯云相关信息
 * @GITHUB github账号
 *
 * @development 开发环境配置
 * @production  生产环境配置
 */

// TODO 密钥信息存放在加密数据库
let { AUTH, QINIU, QCLOUD, EMAIL, AKISMET, BAIDU, SPOTIFY } = require(process.env.HOME.concat('/key/littlewin-server'))

const APP = {
  ROOT_PATH: __dirname,
  LIMIT: 16
}

const INFO = {
  title: 'littlewin.server',
  version: '1.0.0',
  author: 'littlewin',
  site: 'http://littlewin.wang',
  with: ['Node.js', 'MongoDB', 'Koa2', 'Nginx']
}

const GITHUB = {
  account: 'littlewin-wang',
}

const session = {
  key: 'littlewin',
  maxAge: 604800000,
  overwrite: true,
  signed: true,
}

module.exports = {
  // 开发环境配置
  development: {
    AUTH,
    APP,
    INFO,
    QINIU,
    QCLOUD,
    GITHUB,
    session,
    EMAIL,
    AKISMET,
    BAIDU,
    SPOTIFY,
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-dev'
    },
    port: '8090'
  },

  // 生产环境配置
  production: {
    AUTH,
    APP,
    INFO,
    QINIU,
    QCLOUD,
    GITHUB,
    session,
    EMAIL,
    AKISMET,
    BAIDU,
    SPOTIFY,
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-prd'
    },
    port: '8090'
  }
}
