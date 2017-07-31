/**
 * @file 二级分类schema
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  cate_name: { type: String, default: "" }, // 二级分类名
  cate_info: { type: String, default: "" },
  cate_parent: { type: Schema.Types.ObjectId, ref: 'TopCategory' }, // 父分类
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Category', CategorySchema)
