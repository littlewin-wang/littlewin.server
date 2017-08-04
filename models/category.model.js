/**
 * @file 分类模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const CategorySchema = new Schema({

  // 分类名称
  name: { type: String, required: true, validate: /\S+/ },

  // 描述
  description: String,

  // 父分类
  super: { type: Schema.Types.ObjectId, ref: 'Category' },

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date }
})

CategorySchema.set('toObject', { getters: true })

// 翻页 + 自增ID插件配置
CategorySchema.plugin(paginate);
CategorySchema.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
CategorySchema.pre('save', function(next) {
  this.updateAt = Date.now()
  next()
})
CategorySchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

module.exports = mongoose.model('Category', CategorySchema)
