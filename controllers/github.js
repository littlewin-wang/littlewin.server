/**
 * @file Github控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const request = require('request')
const rp = require('request-promise')
const config = require('config/env')[process.env.NODE_ENV||'development']

class Github {
  static async list (ctx) {

    let repos = await rp({
      url: `https://api.github.com/users/${config.GITHUB['account']}/repos`,
      headers: { 'User-Agent': 'request' }
    })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取github项目列表",
      data: {
        projects: JSON.parse(repos)
      }
    }
  }
}

module.exports = Github
