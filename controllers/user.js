/**
 * @file 用户及权限控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const jwt = require('jsonwebtoken')
const md5 = require('md5')
const UserModel = require('models/user.model')
const config = require('config/env')[process.env.NODE_ENV||'development']

class User {
  static async create (ctx) {
    const { username, password } = ctx.request.body

    // 空值检测
    // TODO 考虑是否需要做validation
    if (!username || !password) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "username or password is null."
      }
      return
    }

    // 是否已存在
    let user = await UserModel.findOne({ username }).exec()
    if (user) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "username exists already."
      }
      return
    }

    const token = jwt.sign(
      {
        username,
        password
      },
      config.AUTH.jwtTokenSecret,
      {
        expiresIn: '1d'
      }
    )
    await UserModel.create({
      username,
      password: md5(password),
      token
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "create user success.",
      data: {
        name: username,
        token
      }
    }
  }
}

module.exports = User
