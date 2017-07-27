/**
 * @file project configuration
 * @author littlewin(littlewin.wang@gmail.com)
 */

module.exports = {
  development: {
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-dev'
    },
    port: 8080
  },
  production: {
    mongo: {
      uri: 'mongodb://localhost:27017/littlewin-pro'
    },
    port: 8080
  }
}
