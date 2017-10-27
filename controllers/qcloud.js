/**
 * @file 腾讯云上传控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const config = require('config/env')[process.env.NODE_ENV||'development']

class Qcloud {
  static async getQcloud (ctx) {
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取腾讯云信息",
      data: config.QCLOUD
    }
  }
}

module.exports = Qcloud
