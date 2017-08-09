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
      ctx.throw(401, '标签名为空')
      return
    }

    if (await TagModel.findOne({ name: tag.name }).exec()) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "标签已存在"
      }
      return
    }

    await new TagModel(tag).save()
      .then(() => {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "标签创建成功"
          // TODO sitemap && SEO
        }
      })
      .catch(() => {
        ctx.throw(401, '标签创建失败')
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
      message: "获取所有标签",
      data: {
        tags: tags.docs,
        total: tags.total,
        limit: tags.limit,
        page: tags.page,
        pages: tags.pages
      }
    }
  }

  static async get (ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await TagModel
      .findOne({_id: id})

    if (!isExist) {
      ctx.status = 401,
      ctx.body = {
        success: false,
        message: "标签ID不存在"
      }
    } else {
      ctx.status = 200,
      ctx.body = {
        success: true,
        message: "标签获取成功",
        data: {
          tag: isExist
        }
      }
    }
  }

  static async modify (ctx) {
    const tag = ctx.request.body
    const id = ctx.params.id

    // name validate
    if (!tag.name) {
      ctx.throw(401, '标签名为空')
      return
    }

    // if new category's name duplicated
    const isExist = await TagModel
      .findOne({name: tag.name})

    if (isExist) {
      ctx.status = 401,
      ctx.body = {
        success: false,
        message: "标签已存在",
        data: {
          tag: isExist
        }
      }
    } else {
      let tagItem = await TagModel.findByIdAndUpdate(id, tag, { new: true })

      if (!tagItem) {
        ctx.throw(401, '标签ID不存在')
      } else {
        ctx.status = 200,
        ctx.body = {
          success: true,
          message: "标签更新成功",
          data: {
            tag: tagItem
          }
        }
        // TODO sitemap && SEO
      }
    }
  }

  static async delete (ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await TagModel
      .findOne({_id: id})

    if (!isExist) {
      ctx.status = 401,
      ctx.body = {
        success: false,
        message: "标签ID不存在"
      }
      return
    }

    await TagModel.remove({_id: id})

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "标签删除成功"
    }
  }
}

module.exports = Tag
