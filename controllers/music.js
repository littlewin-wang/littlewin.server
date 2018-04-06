/**
 * @file 音乐控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const NeteseMusic = require('simple-netease-cloud-music')
const neteseMusic = new NeteseMusic()

class Music {
  // 获取歌单列表
  static async getPlaylist (ctx) {
    const id = ctx.params.id

    if (!id || Object.is(Number(id), NaN)) {
      ctx.throw(400, '歌单列表ID无效')
      return
    }

    let playlist = await neteseMusic._playlist(id)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "歌单列表获取成功",
      data: playlist
    }
  }

  // 获取歌曲详情
  static async getMucic (ctx) {
    const id = ctx.params.id

    if (!id || Object.is(Number(id), NaN)) {
      ctx.throw(400, '歌曲ID无效')
      return
    }

    let music = await neteseMusic.song(id)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "歌曲详情获取成功",
      data: music
    }
  }

  // 获取歌曲地址
  static async getUrl (ctx) {
    const id = ctx.params.id

    if (!id || Object.is(Number(id), NaN)) {
      ctx.throw(400, '歌曲ID无效')
      return
    }

    let url = await neteseMusic.url(id, 128)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "歌曲url获取成功",
      data: url
    }
  }

  // 获取歌词
  static async getLrc (ctx) {
    const id = ctx.params.id

    if (!id || Object.is(Number(id), NaN)) {
      ctx.throw(400, '歌曲ID无效')
      return
    }

    let lrc = await neteseMusic.lyric(id)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "歌词获取成功",
      data: lrc
    }
  }

  // 获取歌曲图片封面
  static async getPic (ctx) {
    const id = ctx.params.id

    if (!id || Object.is(Number(id), NaN)) {
      ctx.throw(400, '歌曲ID无效')
      return
    }

    let pic = await neteseMusic.picture(id, 700)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "歌曲封面成功",
      data: pic
    }
  }
}

module.exports = Music
