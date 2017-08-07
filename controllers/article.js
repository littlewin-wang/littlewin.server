/**
 * @file 文章控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const ArticleModel = require('models/article.model')

class Article {
  static async create (ctx) {
    const article = ctx.request.body
    console.log(article)

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
}

module.exports = Article
