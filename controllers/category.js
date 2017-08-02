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
        message: "category already exist."
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
    const categories = await CategoryModel.find().populate('sub').exec()
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "list all categories.",
      data: {
        categories
      }
    }
  }
}

module.exports = Category
