/**
 * @file spotify auth控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const rp = require('request-promise')
const redis = require('db/redis')
const config = require('config/env')[process.env.NODE_ENV || 'development']

const getSpotifyToken = () => {
  const authString = new Buffer(config.SPOTIFY.clientId + ':' + config.SPOTIFY.clientSecret).toString('base64')

  rp({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    json: true,
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then((data) => {
    redis.set('spotify-token', data)
  }).catch((err) => {
    console.warn('spotify token 获取失败 - ', 'err: ', err)
  })

  // 无论成功失败都定时更新，10分钟一次
  setTimeout(getSpotifyToken, 1000 * 60 * 10)
}

// Init data
getSpotifyToken()

class Spotify {
  static async getToken (ctx) {
    // Sync get data
    let token = await redis.get('spotify-token')

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取Spotify token",
      data: JSON.parse(token)
    }
  }
}

module.exports = Spotify
