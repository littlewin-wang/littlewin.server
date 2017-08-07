/**
 * @file 分类控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const CategoryModel = require('models/category.model')

class Category {
  static async create (ctx) {
    const category = ctx.request.body

    // name validate
    if (!category.name) {
      ctx.throw(401, 'category name expected.')
      return
    }

    if (await CategoryModel.findOne({ name: category.name }).exec()) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "category already exists."
      }
      return
    }

    await new CategoryModel(category).save()
      .then(() => {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "create category success."
          // TODO sitemap && SEO
        }
      })
      .catch(() => {
        ctx.throw(401, 'create category error.')
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

    const categories = await CategoryModel.paginate({}, options)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "list all categories.",
      data: {
        categories: categories.docs,
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
        message: "category id not exist."
      }
    } else {
      ctx.status = 200,
      ctx.body = {
        success: true,
        message: "get category success.",
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
      ctx.throw(401, 'category name expected.')
      return
    }

    // if new category's name duplicated
    const isExist = await CategoryModel
      .findOne({name: category.name})

    if (isExist) {
      ctx.status = 401,
      ctx.body = {
        success: false,
        message: "category name exists.",
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
        ctx.throw(401, 'No category with the given ID')
      } else {
        ctx.status = 200,
        ctx.body = {
          success: true,
          message: "category update success.",
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
        message: "category id not exist."
      }
      return
    }

    await CategoryModel.remove({_id: id})

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "category delete success."
    }
  }
}

module.exports = Category
