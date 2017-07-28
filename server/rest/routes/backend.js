/**
 * @file backend routes
 * @author littlewin(littlewin.wang@gmail.com)
 */

import { BackendUser } from '../controllers/backend.export'
const router = require('koa-router')()

router
  .post('/server/login', BackendUser.signIn)
  .post('/server/user/create_user', BackendUser.create_user)
  .get('/server/signout', BackendUser.signOut)

module.exports = router
