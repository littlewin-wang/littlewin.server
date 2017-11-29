/**
 * @file Google Analytics控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const request = require('request')
const config = require('config/env')[process.env.NODE_ENV || 'development']

class GA {
  static async post (ctx) {
    let { query } = ctx.request.body

    if (!query) {
      ctx.throw(404, "谷歌分析提交参数为空")
    }

    const ip = (ctx.header['x-forwarded-for'] || ctx.header['x-real-ip'] || ctx.ip || ctx.ips[0])

    query += `&dh=${config.INFO.site}&tid=${config.INFO.GA}&uip=${ip}`

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "谷歌分析已提交"
    }

    request.get({
      url: `https://www.google-analytics.com/collect${query}`,
    })
  }
}

module.exports = GA
