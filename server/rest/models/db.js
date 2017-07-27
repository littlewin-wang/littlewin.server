/**
 * @file connect database
 * @author littlewin(littlewin.wang@gmail.com)
 */

const mongoose = require('mongoose')
const config = require('../../config/env')
const dbConfig = config[process.env.NODE_ENV||'development']

mongoose.connect(dbConfig.mongo.uri)

// Connection success
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + dbConfig.mongo.uri)
})

// Connection failed
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error ' + err)
})

// Connection disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})
