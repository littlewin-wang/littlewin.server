/**
 * @file 数据库连接
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('mongoose')
const config = require('../../config/env')

const dbConfig = config[process.env.NODE_ENV||'development']

mongoose.connect(dbConfig.mongo.uri)

// 连接成功
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + dbConfig.mongo.uri)
})

// 连接失败
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err)
})

// 断开连接
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})
