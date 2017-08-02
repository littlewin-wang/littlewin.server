/**
 * @file routes
 * @author littlewin(littlewin.wang@gmail.com)
 */

const router = require('koa-router')()
const User = require('controllers/user')

router
  .get('/', (ctx) => {
    ctx.body = 'Hello World!'
  })
  .post('/user', User.create)

module.exports = router
