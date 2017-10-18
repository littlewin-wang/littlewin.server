/**
 * @file 用户及权限数据模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const Schema = mongoose.Schema
const md5 = require('md5')
const config = require('config/env')[process.env.NODE_ENV || 'development']

const UserSchema = new Schema({
  // 用户名
  username: { type: String, default: '' },

  // 密码
  password: {
    type: String,
    default: md5(config.AUTH.default.password)
  },

  // 签名
  slogan: { type: String, default: '' },

  // 头像
  gravatar: { type: String, default: '' },

  // 扩展属性
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]
})

module.exports = mongoose.model('User', UserSchema)
