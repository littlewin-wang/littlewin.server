/**
 * @file 网站地图生成
 * @author littlewin(littlewin.wang@gmail.com)
 */

const fs = require('fs')
const sm = require('sitemap')

const SiteModel = require('models/site.model')
const ArticleModel = require('models/article.model')
const CategoryModel = require('models/category.model')
const TagModel = require('models/tag.model')

const createSiteMap = async () => {
  let site = await SiteModel.findOne({})
  let pages = [
    { url: '', changefreq: 'always', priority: 1 },
    { url: '/about', changefreq: 'monthly', priority: 1 },
    { url: '/github', changefreq: 'monthly', priority: 1 },
    { url: '/sitemap', changefreq: 'always', priority: 1 },
    { url: '/guest', changefreq: 'always', priority: 1 }
  ]

  let sitemap = sm.createSitemap({
    hostname: site ? site.site_url : 'http://littlewin.wang',
    cacheTime: 600000,
    urls: [...pages]
  })

  let articles = await ArticleModel.find({ state: 1, pub: 1 }).sort({ createAt: -1 })
  articles.forEach(article => {
    sitemap.add({
      url: `/article/${article.id}`,
      changefreq: 'daily',
      lastmodISO: article.createAt.toISOString(),
      priority: 0.8
    })
  })

  let categories = await CategoryModel.find().sort({ '_id': -1 })
  categories.forEach(category => {
    sitemap.add({
      url: `/category/${category.name}`,
      changefreq: 'daily',
      priority: 0.6
    })
  })

  let tags = await TagModel.find().sort({ '_id': -1 })
  tags.forEach(tag => {
    sitemap.add({
      url: `/tag/${tag.name}`,
      changefreq: 'daily',
      priority: 0.6
    })
  })

  fs.writeFileSync("../littlewin.wang/static/sitemap.xml", sitemap.toString())
}

module.exports = createSiteMap
