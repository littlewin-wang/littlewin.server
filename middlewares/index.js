/**
 * @file middlewares统一出口
 * @author littlewin(littlewin.wang@gmail.com)
 */

const verifyToken = require('./verifyToken')
const errorHandler= require('./errorHandler')

module.exports = {
  verifyToken,
  errorHandler
}
