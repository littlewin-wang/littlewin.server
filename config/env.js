/**
 * @file 项目配置文件
 * @author littlewin(littlewin.wang@gmail.com)
 *
 * @AUTH 默认账户
 * @mongo && port  数据库连接配置
 *
 * @development 开发环境配置
 * @production  生产环境配置
 */

let AUTH = {
  default: { name: 'admin', password: '123456' },
  jwtTokenSecret: 'littlewin'
}

let APP = {
  ROOT_PATH: __dirname,
  LIMIT: 16
}

let session = {
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
    session,
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-dev'
    },
    port: '8090'
  },

  // 生产环境配置
  production: {
    AUTH,
    APP,
    session,
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-prd'
    },
    port: '8090'
  }
}
