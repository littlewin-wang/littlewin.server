const Koa = require('koa')
const app = new Koa()
const convert = require('koa-convert')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')
const session = require('koa-session')

const router  = require('./routes')

// cookies
app.keys = ['littlewin']
const CONFIG = {
  key: 'littlewin',
  maxAge: 604800000,
  overwrite: true,
  signed: true,
}

// middleware
app.use(convert(logger()))
   .use(convert(session(CONFIG, app)))
   .use(bodyparser)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// router
app.use(router.routes(), router.allowedMethods())

module.exports = app
