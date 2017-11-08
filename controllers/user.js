/**
 * @file 用户及权限控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const jwt = require('jsonwebtoken')
const md5 = require('md5')
const UserModel = require('models/user.model')
const config = require('config/env')[process.env.NODE_ENV||'development']

class User {
  static async get (ctx) {
    let user = await UserModel.find({}, '-_id username slogan gravatar')

    if (user.length) {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "用户信息获取成功",
        data: {
          user: user[0]
        }
      }
    } else {
      ctx.throw(404, '暂无用户信息')
    }
  }

  static async login (ctx) {
    const { username, password } = ctx.request.body

    let user = await UserModel.find({}, '-_id password')

    if (user.length) {
      if (md5(password) !== user[0].password) {
        ctx.throw(401, "大胆！擅闯此地！")
      }
    } else {
      if (password !== config.AUTH.default.password) {
        ctx.throw(401, "大胆！擅闯此地！")
      }
    }

    let token = jwt.sign(
      {
        username,
        password
      },
      config.AUTH.jwtTokenSecret,
      {
        expiresIn: '4h'
      }
    )

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "登录成功",
      data: {
        token
      }
    }
  }

  static async modify (ctx) {
    const { username, slogan, gravatar, password, new_password = '', new_password_ag = '' } = ctx.request.body
    let newUser, newPWD

    if (!!new_password && !!new_password_ag) {
      // 验证密码
      if (!!password && ((!new_password || !new_password_ag) || !Object.is(new_password, new_password_ag))) {
        ctx.throw(400, "密码不一致或无效")
      }

      if (!!password && [new_password, new_password_ag].includes(password)) {
        ctx.throw(400, "新旧密码不可一致")
      }

      newPWD = new_password
    } else {
      newPWD = password
    }

    let user = await UserModel.find({}, '_id username slogan gravatar password')

    if (user.length) {
      if (md5(password) !== user[0].password) {
        ctx.throw(401, "大胆！擅闯此地！")
      } else {
        newUser = await UserModel.findByIdAndUpdate(user[0]._id, {
          username,
          password: md5(newPWD),
          slogan,
          gravatar
        }, { new: true })
      }
    } else {
      if (password !== config.AUTH.default.password) {
        ctx.throw(401, "大胆！擅闯此地！")
      } else {
        newUser = await new UserModel({
          username,
          password: md5(newPWD),
          slogan,
          gravatar
        }).save()
      }
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "用户修改成功",
      data: {
        user: newUser
      }
    }
  }
}

module.exports = User
