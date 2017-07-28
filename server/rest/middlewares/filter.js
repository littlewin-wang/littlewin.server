/**
 * @file 用于捕获内部错误，输出日志信息
 * @author littlewin(littlewin.wang@gmail.com)
 */

const tracer = require('tracer')
const logger = tracer.colorConsole({
  level: 'error',
  format: '{{timestamp}} <{{title}}> {{file}}(#{{line}}): {{message}}',
  file: 'error.log',
  path: __dirname
})

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (!err) {
      return ctx.error({ msg: new Error('未知错误!') })
    }

    if (typeof(err) === 'string') {
      return ctx.error({ msg: new Error(err) })
    }

    logger.error(err.stack)

    ctx.error({
      msg: '服务器错误!',
      error: err,
      status: ctx.status
    })
  }
}
