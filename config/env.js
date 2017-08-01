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
  data: { user: 'root' },
  jwtTokenSecret: 'littlewin',
  defaultPassword: '544574'
}

module.exports = {
  // 开发环境配置
  development: {
    AUTH,
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-dev'
    },
    port: '8090'
  },

  // 生产环境配置
  production: {
    AUTH,
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-prd'
    },
    port: '8090'
  }
}
