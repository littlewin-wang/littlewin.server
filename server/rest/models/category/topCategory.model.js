/**
 * @file 一级分类schema
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TopCategorySchema = new Schema({
  top_cate_name: { type: String, default: "" }, // 一级分类名
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('TopCategory', TopCategorySchema)
