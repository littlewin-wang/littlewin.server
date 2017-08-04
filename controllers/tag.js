/**
 * @file 标签控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const TagModel = require('models/tag.model')

class Tag {
  static async create (ctx) {
    const tag = ctx.request.body

    // name validate
    if (!tag.name) {
      ctx.throw(401, 'tag name expected.')
      return
    }

    if (await TagModel.findOne({ name: tag.name }).exec()) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "tag already exists."
      }
      return
    }

    await new TagModel(tag).save()
      .then(() => {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "create tag success."
          // TODO sitemap && SEO
        }
      })
      .catch(() => {
        ctx.throw(401, 'create tag error.')
      })
  }

  static async list (ctx) {
    let { page = 1, per_page = 10 } = ctx.query

    // 过滤条件
    const options = {
      sort: { _id: 1 },
      page: Number(page),
      limit: Number(per_page)
    }

    // TODO 增加Article到category的聚合数据

    const tags = await TagModel.paginate({}, options)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "list all categories.",
      data: {
        tags: tags.docs,
        total: tags.total,
        limit: tags.limit,
        page: tags.page,
        pages: tags.pages
      }
    }
  }
}

module.exports = Tag
