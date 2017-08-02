/**
 * @file routes
 * @author littlewin(littlewin.wang@gmail.com)
 */

const router = require('koa-router')()
const User = require('controllers/user')
const Category = require('controllers/category')
const middleware = require('middlewares')

router
  .get('/', (ctx) => {
    ctx.body = 'Hello World!'
  })
  .post('/login', User.login)
  .post('/user', middleware.verifyToken, User.create)

  .post('/category', Category.create)

module.exports = router
