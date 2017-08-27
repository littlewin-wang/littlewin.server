/**
 * @file 七牛上传控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const qiniu = require('qn')
const config = require('config/env')[process.env.NODE_ENV||'development']
const client = qiniu.create(config.QINIU)

class Qiniu {
  static async getToken (ctx) {
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取七牛token",
      data: {
        origin: config.QINIU.origin,
        uploadURL: config.QINIU.uploadURL,
        upToken: client.uploadToken()
      }
    }
  }
}

module.exports = Qiniu
