/**
 * @file 事件数据模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const EventSchema = new Schema({
  // 事件执行者
  person: { type: String, required: true, validate: /\S+/ },

  // 事件动作
  action: { type: String, required: true, validate: /\b(NEW|MODIFY|DELETE|LIKE)\b/ },

  // 事件目标类型
  targetType: { type: String, required: true, validate: /\b(ARTICLE|CATEGORY|TAG|COMMENT|SITE)\b/ },

  // 事件目标ID
  targetID: { type: mongoose.Schema.Types.ObjectId, required: true },

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date },

  // 扩展属性
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]
})

// 翻页 + 自增ID插件配置
EventSchema.plugin(paginate);
EventSchema.plugin(autoIncrement.plugin, {
  model: 'Event',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
EventSchema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})
EventSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

module.exports = mongoose.model('Event', EventSchema)
