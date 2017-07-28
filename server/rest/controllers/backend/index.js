/**
 * @file 管理后台接口逻辑层
 * @author littlewin(littlewin.wang@gmail.com)
 */

class BackendMain {
  // 登录页
  static async index (ctx) {
    return ctx.render('login', { title: 'littlewin的小黑屋' })
  }
}

export default BackendMain
