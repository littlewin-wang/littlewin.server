/**
 * @file 用户及权限控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const jwt = require('jsonwebtoken')
const md5 = require('md5')
const UserModel = require('models/user.model')
const config = require('config/env')[process.env.NODE_ENV||'development']

class User {
  static async login (ctx) {
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

    // 默认账户
    if (username === config.AUTH.default.name && password === config.AUTH.default.password) {
      let token = jwt.sign(
        {
          username,
          password
        },
        config.AUTH.jwtTokenSecret,
        {
          expiresIn: '1h'
        }
      )

      ctx.status = 200
      ctx.body = {
        success: true,
        message: "Login success.",
        data: {
          name: username,
          token
        }
      }
      return
    }

    // 用户名或密码错误
    const result = await UserModel.findOne({username, password: md5(password)})
    if (!result) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "username or password incorrect."
      }
    } else {
      let token = jwt.sign(
        {
          username,
          password
        },
        config.AUTH.jwtTokenSecret,
        {
          expiresIn: '1h'
        }
      )

      ctx.status = 200
      ctx.body = {
        success: true,
        message: "Login success.",
        data: {
          name: username,
          token
        }
      }
    }
  }

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
        expiresIn: '1h'
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
