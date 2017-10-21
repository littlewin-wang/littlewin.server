/**
 * @file 网站地图控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const fs = require('fs')

const createSiteMap = require('utils/sitemap')

class SiteMap {
  static async get (ctx) {
    let sitemap = await createSiteMap()

    ctx.status = 200
    ctx.set('Content-Type', 'application/xml')
    ctx.body = sitemap

    // BUG 404
    // ctx.body = fs.createReadStream('../littlewin.wang/static/sitemap.xml')
  }
}

module.exports = SiteMap
