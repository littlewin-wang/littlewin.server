/**
 * @file 用户及权限数据模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const crypto = require('crypto')
const config = require('../config/env')[process.env.NODE_ENV||'development']
const mongoose = require('../database/mongodb').mongoose
const Schema = mongoose.Schema

const AuthSchema = new Schema({
  // 用户名
  name: { type: String, default: '' },

  // 签名
  slogan: { type: String, default: '' },

  // 头像
  gravatar: { type: String, default: '' },

  // 密码
  password: {
    type: String,
    required: crypto.createHash('md5').update(config.AUTH.defaultPassword).digest('hex')
  }
})

module.exports = mongoose.model('Auth', AuthSchema)
