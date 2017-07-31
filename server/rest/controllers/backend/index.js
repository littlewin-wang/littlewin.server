/**
 * @file 管理后台接口逻辑层
 * @author littlewin(littlewin.wang@gmail.com)
 */

const { CategoryModel, TopCategoryModel } = require('../../models/index')

const title = 'Littlewin Blog Admin'

class BackendMain {
  // 登录页
  static async index (ctx) {
    return ctx.render('login', { title })
  }

  // 首页
  static async home (ctx) {
    console.log(ctx)
    const user = ctx.session.user
    return ctx.render('home', { title, message: '这里是首页', user })
  }

  // 分类
  static async category (ctx) {
    let index = 1
    let current = 1
    const user = ctx.session.user
    const { type, model, item, page } = ctx.query

    // 选择一级分类还是二级分类
    if (item) {
      index = item
    }

    // 选择表格分页
    if (page) {
      current = page
    }

    const limit = 6
    const skip = (Number(current) - 1) * limit

    const count = await mongoose.model(model).count()
  }
}

export default BackendMain
