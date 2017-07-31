/**
 * @file backend routes
 * @author littlewin(littlewin.wang@gmail.com)
 */

import { BackendMain, BackendUser, BackendCategory } from '../controllers/backend.export'
const router = require('koa-router')()

router
  .get('/', BackendMain.index)

  .post('/server/login', BackendUser.signIn)
  .post('/server/user/create_user', BackendUser.create_user)
  .get('/server/signout', BackendUser.signOut)

  .get('/server/home', BackendMain.home)

  .get('/server/category', BackendMain.category)
  .post('/server/article/create_top_cate', BackendCategory.create_top_cate)
  .post('/server/article/create_sub_cate', BackendCategory.create_sub_cate)

module.exports = router
