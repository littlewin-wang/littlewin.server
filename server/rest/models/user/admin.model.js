/**
 * @file backend admin user schema
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports=mongoose.model('Admin', AdminSchema)
