/**
 * @file token验证
 * @author littlewin(littlewin.wang@gmail.com)
 */

const jwt = require('jsonwebtoken')
const config = require('config/env')[process.env.NODE_ENV||'development']

module.exports = async (ctx, next) => {
  const authorzation = ctx.request.header.authorization

  if (!authorzation) {
    ctx.throw(401, 'No token detected.')
  }

  const token = authorzation.split(' ')[1]
  let tokenContent
  try {
    tokenContent = await jwt.verify(token, config.AUTH.jwtTokenSecret)
  } catch (err) {
    // Token 过期
    if (err.name === 'TokenExpiredError') {
      ctx.throw(401, 'Token expried')
    }
    // Token 验证失败
    ctx.throw(401, 'Invalid Token')
  }

  ctx.token = tokenContent
  return await next()
}
