/**
 * @file 文章控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const ArticleModel = require('models/article.model')

class Article {
  static async create (ctx) {
    const article = ctx.request.body

    if (!article.title || !article.content) {
      ctx.throw(401, '文章标题或内容为空')
      return
    }

    await new ArticleModel(article).save()
      .then(() => {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "create article success."
          // TODO sitemap && SEO
        }
      })
      .catch(() => {
        ctx.throw(401, 'create article error.')
      })
  }

  static async list(ctx) {
    let { page, per_page, state, pub, keyword, category, tag, date, hot } = ctx.query

    // filter options
    const options ={
      sort: { _id: -1 },
      page: Number(page || 1),
      limit: Number(per_page || 10),
      populate: ['category', 'tag'],
      select: '-password -content'
    }

    // 查询参数
    let querys = {}

    // 按照state查询
    if (['0', '1', '-1'].includes(state)) {
      querys.state = state
    }

    // 按照公开程度查询
    if (['0', '1', '-1'].includes(pub)) {
      querys.pub = pub;
    }

    // 关键词查询
    if (keyword) {
      const keywordReg = new RegExp(keyword);
      querys['$or'] = [
        { 'title': keywordReg },
        { 'content': keywordReg },
        { 'description': keywordReg }
      ]
    }

    // 标签id查询
    if (tag) {
      querys.tag = tag
    }

    // 分类id查询
    if (category) {
      querys.category = category
    }

    // 热评查询
    if (!!hot) {
      options.sort = {
        'meta.comments': -1,
        'meta.likes': -1
      }
    }

    // 时间查询
    if (date) {
      const getDate = new Date(date);
      if(!Object.is(getDate.toString(), 'Invalid Date')) {
        querys.create_at = {
          "$gte": new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
          "$lt": new Date((getDate / 1000 + 60 * 60 * 16) * 1000)
        }
      }
    }

    const articles = await ArticleModel.paginate(querys, options)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "list all articles.",
      data: {
        articles: articles.docs,
        total: articles.total,
        limit: articles.limit,
        page: articles.page,
        pages: articles.pages
      }
    }
  }
}

module.exports = Article
