/**
 * @file redis管理模块
 * @author littlewin(littlewin.wang@gmail.com)
 */

const redis = require('redis')
const bluebird = require('bluebird')

// use redis with promises
bluebird.promisifyAll(redis.RedisClient.prototype)

let redisClientAvailable = false
let redisClient = null
const memoryClient = {}

exports.set = (key, value, callback) => {
  if (redisClientAvailable) {
    if (typeof value !== 'string') {
      try {
        value = JSON.stringify(value)
      } catch (err) {
        value = value.toString()
      }
    }
    redisClient.set(key, value, callback)
  } else {
    memoryClient[key] = value
  }
}

exports.get = async (key) => {
  if (redisClientAvailable) {
    return await redisClient.getAsync(key)
  } else {
    return memoryClient[key]
  }
}

exports.connect = () => {
  redisClient = redis.createClient({ detect_buffers: true })

  redisClient.on('error', err => {
    redisClientAvailable = false
    console.log('Redis连接失败！' + err)
  })

  redisClient.on('ready', err => {
    console.log('Redis已准备好！')
    redisClientAvailable = true;
  })

  redisClient.on('reconnecting', err => {
    console.log('Redis正在重连！')
  })

  return redisClient
}
