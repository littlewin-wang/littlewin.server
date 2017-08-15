/**
 * @file 分类控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const CategoryModel = require('models/category.model')
const ArticleModel = require('models/article.model')

class Category {
  static async create (ctx) {
    const category = ctx.request.body

    // name validate
    if (!category.name) {
      ctx.throw(401, '需要提供分类名')
      return
    }

    if (await CategoryModel.findOne({ name: category.name }).exec()) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "分类已存在"
      }
      return
    }

    await new CategoryModel(category).save()
      .then(() => {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "分类创建成功"
          // TODO sitemap && SEO
        }
      })
      .catch(() => {
        ctx.throw(401, '分类创建失败')
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

    const categories = await CategoryModel.paginate({}, options)

    let $match = {}
    // 如果是前端来的请求，只能请求公开发布的东西
    // $match = { state: 1, public: 1 }

    let counts = await ArticleModel.aggregate([
      { $match },
      { $unwind : "$category" },
      { $group: {
        _id: "$category",
        num_tutorial: { $sum : 1 }}
      }
    ])

    let newDocs = categories.docs.map(category => {
      const match = counts.find(count => {
        return String(count._id) === String(category._id)
      })
      category._doc.count = match ? match.num_tutorial : 0
      return category
    })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "分类列表获取成功",
      data: {
        categories: newDocs,
        total: categories.total,
        limit: categories.limit,
        page: categories.page,
        pages: categories.pages
      }
    }
  }

  static async get (ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await CategoryModel
      .findOne({_id: id})

    if (!isExist) {
      ctx.status = 401,
      ctx.body = {
        success: false,
        message: "分类ID不存在"
      }
    } else {
      ctx.status = 200,
      ctx.body = {
        success: true,
        message: "分类获取成功",
        data: {
          category: isExist
        }
      }
    }
  }

  static async modify (ctx) {
    const category = ctx.request.body
    const id = ctx.params.id

    // name validate
    if (!category.name) {
      ctx.throw(401, '需要提供分类名')
      return
    }

    // if new category's name duplicated
    const isExist = await CategoryModel
      .findOne({name: category.name})

    if (isExist) {
      ctx.status = 401,
      ctx.body = {
        success: false,
        message: "分类名已存在",
        data: {
          category: isExist
        }
      }
    } else {
      let pid = category.super
      if (['', '0', 'null', 'false'].includes(pid) || !pid || Object.is(pid, id)) {
        category.super = null
      }

      let cate = await CategoryModel.findByIdAndUpdate(id, category, { new: true })

      if (!cate) {
        ctx.throw(401, '该分类ID不存在')
      } else {
        ctx.status = 200,
        ctx.body = {
          success: true,
          message: "分类更新成功",
          data: {
            category: cate
          }
        }
        // TODO sitemap && SEO
      }
    }
  }

  static async delete (ctx) {
    const id = ctx.params.id

    // name validate
    let isExist = await CategoryModel
      .findOne({_id: id})

    if (!isExist) {
      ctx.status = 401,
      ctx.body = {
        success: false,
        message: "分类ID不存在"
      }
      return
    }

    await CategoryModel.remove({_id: id})

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "分类删除成功"
    }
  }
}

module.exports = Category
