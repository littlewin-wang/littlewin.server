/**
 * @file 网站地图控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const fs = require('fs')

require('utils/sitemap')()

class SiteMap {
  static async get (ctx) {
    ctx.status = 200
    ctx.set('Content-Type', 'application/xml')
    ctx.body = fs.createReadStream('../littlewin.wang/static/sitemap.xml')
  }
}

module.exports = SiteMap
