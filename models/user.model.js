/**
 * @file 用户及权限数据模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const Schema = mongoose.Schema

const UserSchema = new Schema({
  // 用户名
  username: { type: String, default: '' },

  // 密码
  password: { type: String },

  // 签名
  slogan: { type: String, default: '' },

  // 头像
  gravatar: { type: String, default: '' }
})

module.exports = mongoose.model('User', UserSchema)
