/**
 * @file Github控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const request = require('request')
const rp = require('request-promise')
const redis = require('db/redis')
const config = require('config/env')[process.env.NODE_ENV || 'development']

const getGithubRepos = () => {
  rp({
    url: `https://api.github.com/users/${config.GITHUB['account']}/repos`,
    headers: { 'User-Agent': 'request' }
  }).then((data) => {
    redis.set('github-repos', data)
  }).catch((err) => {
    console.warn('项目列表获取失败 - ', 'err: ', err)
  })

  // 无论成功失败都定时更新，10分钟一次
  setTimeout(getGithubRepos, 1000 * 60 * 10)
}

// Init data
getGithubRepos()

class Github {
  static async list (ctx) {
    // Sync get data
    let repos = await redis.get('github-repos')

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
