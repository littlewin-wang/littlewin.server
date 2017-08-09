/**
 * @file 评论数据模型
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const CommentSchema = new Schema({
  // 第三方评论id
  thirdID: { type: Number },

  // 评论所在文章id， 0代表系统留言板
  postID: { type: Number, required: true},

  // pid, 0代表默认留言
  pid: { type: Number, default: 0 },

  // content
  content: { type: String, required: true, validate: /\S+/ },

  // 是否置顶
  isTop: { type: Boolean, default: false },

  // 点赞数
  likes: { type: Number, default: 0 },

  // 评论产生者
  author: {
    name: { type: String, required: true, validate: /\S+/ },
    email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
    site: { type: String, validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ }
  },

  // IP地址
  ip: { type: String },

  // ip物理地址
  ip_location: { type: Object },

  // 用户ua
  agent: { type: String, validate: /\S+/ },

  // 状态 0待审核/1通过正常/-1已删除/-2垃圾评论
  state: { type: Number, default: 1 },

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date }
})

// 翻页 + 自增ID插件配置
CommentSchema.plugin(paginate);
CommentSchema.plugin(autoIncrement.plugin, {
  model: 'Comment',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
CommentSchema.pre('save', function(next) {
  this.updateAt = Date.now()
  next()
})
CommentSchema.pre('findOneAndUpdate', function(next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

module.exports = mongoose.model('Comment', CommentSchema)
