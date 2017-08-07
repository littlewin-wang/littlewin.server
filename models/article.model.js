/**
 * @file 文章数据模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const ArticleSchema = new Schema({

  // 文章标题
  title: { type: String, required: true, validate: /\S+/ },

  // 文章关键词
  keywords: [{ type: String }],

  // 描述
  description: String,

  // 文章内容
  content: { type: String, required: true, validate: /\S+/ },

  // 缩略图
  thumb: String,

  // 文章发布状态 => -1回收站，0草稿，1已发布
  state: { type: Number, default: 1 },

  // 文章公开状态 = // -1私密，0需要密码，1公开
  public: { type: Number, default: 1 },

  // 文章密码 => 加密状态生效
  password: { type: String, default: '' },

  // 文章标签
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],

  // 文章分类
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],

  // 其他元信息
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date }
})

ArticleSchema.set('toObject', { getters: true })

// 翻页 + 自增ID插件配置
ArticleSchema.plugin(paginate);
ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
ArticleSchema.pre('save', function(next) {
  this.updateAt = Date.now()
  next()
})
ArticleSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

ArticleSchema.virtual('t_content').get(function() {
  const content = this.content
  return !!content ? content.substring(0, 130) : content
})

module.exports = mongoose.model('Article', ArticleSchema)
