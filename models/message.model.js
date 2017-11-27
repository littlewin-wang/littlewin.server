/**
 * @file 个人公告数据模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const MessageSchema = new Schema({
  // 公告内容
  content: { type: String, required: true, validate: /\S+/ },

  // 公告发布状态 => 0草稿，1已发布
  state: { type: Number, default: 1 },

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date }
})

// 翻页 + 自增ID插件配置
MessageSchema.plugin(paginate);
MessageSchema.plugin(autoIncrement.plugin, {
  model: 'Message',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
MessageSchema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})
MessageSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

module.exports = mongoose.model('Message', MessageSchema)
