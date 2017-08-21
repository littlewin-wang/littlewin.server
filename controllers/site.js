/**
 * @file 网站信息控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const SiteModel = require('models/site.model')

const config = require('config/env')[process.env.NODE_ENV||'development']

class Site {
  static async get (ctx) {
    let site = await SiteModel.findOne({})

    if (!site) {
      ctx.throw(404, "网站信息为空")
    }

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "网站信息获取成功",
      data: {
        site
      }
    }
  }

  static async modify (ctx) {
    const siteInfo  = ctx.request.body

    let site = await SiteModel.findOne({})
    let _id

    if (!!site) {
      _id = site._id
      // keep likes when update site
      siteInfo.meta.likes = site.meta.likes
    }

    // 如果有_id则去除_id
    delete siteInfo._id

    // 检测黑名单和ping地址列表不能存入空元素
    if (siteInfo.blacklist) {
      siteInfo.blacklist.ips = (siteInfo.blacklist.ips || []).filter(t => !!t)
      siteInfo.blacklist.mails = (siteInfo.blacklist.mails || []).filter(t => !!t)
      siteInfo.blacklist.keywords = (siteInfo.blacklist.keywords || []).filter(t => !!t)
    }
    
    let result = !!_id ? await SiteModel.findByIdAndUpdate(_id, siteInfo, { new: true }) : await new SiteModel(siteInfo).save()

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "网站信息更新成功",
      data: {
        site: result
      }
    }
  }
}

module.exports = Site
