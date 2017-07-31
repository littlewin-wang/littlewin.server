/**
 * @file 管理后台接口逻辑层
 * @author littlewin(littlewin.wang@gmail.com)
 */

const  title = 'Littlewin Blog Admin'

class BackendMain {
  // 登录页
  static async index (ctx) {
    return ctx.render('login', { title })
  }

  // 首页
  static async home (ctx) {
    const user = ctx.session.user
    return ctx.render('home', { title, message: '这里是首页', user })
  }
}

export default BackendMain
