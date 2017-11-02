/**
 * @file 服务器状态回传
 * @author littlewin(littlewin.wang@gmail.com)
 */

const osu = require('node-os-utils')

class Server {
  static async getServer (ctx) {
    // cpu stat
    let cpu = osu.cpu
    let cpuUsage = await cpu.usage()
    let cpuAverage = await cpu.average()

    // mem stat
    let mem = osu.mem
    let memInfo = await mem.info()

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取服务器信息",
      data: {
        cpu: {
          cpuUsage,
          cpuAverage
        },
        mem: {
          memInfo
        }
      }
    }
  }
}

module.exports = Server
