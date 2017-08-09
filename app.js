require('app-module-path').addPath(__dirname + '/');

const Koa = require('koa')
const app = new Koa()

const convert = require('koa-convert')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')

const mongodb = require('db/mongodb')
const mongoosePaginate = require('mongoose-paginate')

const config = require('config/env')[process.env.NODE_ENV||'development']
const middleware = require('middlewares')
const router  = require('./routes')

// data server
mongodb.connect()

// global options
mongoosePaginate.paginate.options = {
  limit: config.APP.LIMIT
}

app.proxy = true

// middleware
app.use(convert(logger()))
   .use(bodyparser)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// router
app.use(middleware.errorHandler)
app.use(router.routes(), router.allowedMethods())

module.exports = app
