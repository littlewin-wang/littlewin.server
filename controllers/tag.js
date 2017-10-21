/**
 * @file 标签控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const TagModel = require('models/tag.model')
const ArticleModel = require('models/article.model')

const createSiteMap = require('utils/sitemap')

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
        }
        // generate sitemap
        createSiteMap()

        // TODO push seo
      })
      .catch(() => {
        ctx.throw(401, '标签创建失败')
      })
  }

  static async list (ctx) {
    let { page = 1, per_page = 10, keyword = '' } = ctx.query

    // 过滤条件
    const options = {
      sort: { _id: 1 },
      page: Number(page),
      limit: Number(per_page)
    }

    // 查询参数
    const keywordReg = new RegExp(keyword)
    const query = {
      "$or": [
        { 'name': keywordReg },
        { 'description': keywordReg }
      ]
    }

    const tags = await TagModel.paginate(query, options)

    let $match = {}
    // 如果是前端来的请求，只能请求公开发布的东西
    // $match = { state: 1, public: 1 }

    let counts = await ArticleModel.aggregate([
      { $match },
      { $unwind: "$tag" },
      {
        $group: {
          _id: "$tag",
          num_tutorial: { $sum: 1 }
        }
      }
    ])

    let newDocs = tags.docs.map(tag => {
      const match = counts.find(count => {
        return String(count._id) === String(tag._id)
      })
      tag._doc.count = match ? match.num_tutorial : 0
      return tag
    })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取所有标签",
      data: {
        tags: newDocs,
        total: tags.total,
        limit: tags.limit,
        page: tags.page,
        pages: tags.pages
      }
    }

    // TODO 区分管理员请求和前端请求
    // TODO 是否需要做前台请求缓存
  }

  static async deleteList (ctx) {
    const { tags } = ctx.request.body

    if (!tags || !tags.length) {
      ctx.throw(401, '缺少有效参数')
      return
    }

    let result = await TagModel.remove({ '_id': { $in: tags } })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "标签批量删除成功",
      data: {
        result
      }
    }
    // generate sitemap
    createSiteMap()
  }

  static async get (ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await TagModel
      .findOne({ _id: id })

    if (!isExist) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "标签ID不存在"
      }
    } else {
      ctx.status = 200
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
      .findOne({ name: tag.name })

    if (isExist && String(isExist._id) !== id) {
      ctx.status = 401
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
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "标签更新成功",
          data: {
            tag: tagItem
          }
        }
        // generate sitemap
        createSiteMap()

        // TODO push seo
      }
    }
  }

  static async delete (ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await TagModel
      .findOne({ _id: id })

    if (!isExist) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "标签ID不存在"
      }
      return
    }

    await TagModel.remove({ _id: id })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "标签删除成功"
    }

    // generate sitemap
    createSiteMap()
  }
}

module.exports = Tag
