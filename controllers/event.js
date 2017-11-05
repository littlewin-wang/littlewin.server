/**
 * @file 评论控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const EventModel = require('models/event.model')

class Event {
  static async list (ctx) {
    let { page = 1, per_page = 10, keyword = '' } = ctx.query

    // 过滤条件
    const options = {
      sort: { createAt: -1 },
      page: Number(page),
      limit: Number(per_page)
    }

    // 查询参数(根据执行人或者备注)
    const keywordReg = new RegExp(keyword)
    const query = {
      "$or": [
        { 'person': keywordReg },
        { 'description': keywordReg }
      ]
    }

    const events = await EventModel.paginate(query, options)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取事件列表",
      data: {
        events: events.docs,
        total: events.total,
        limit: events.limit,
        page: events.page,
        pages: events.pages
      }
    }
  }

  static async get (ctx) {
    const id = ctx.params.id

    let isExist = await EventModel.findOne({ _id: id })

    if (!isExist) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: "事件ID不存在"
      }
    } else {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "事件获取成功",
        data: {
          event: isExist
        }
      }
    }
  }

  static async delete (ctx) {
    const id = ctx.params.id

    let isExist = await EventModel.findOne({ _id: id })

    if (!isExist) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: "事件ID不存在"
      }
      return
    }

    await EventModel.remove({ _id: id })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "事件删除成功"
    }
  }

  static async deleteList (ctx) {
    const { events } = ctx.request.body

    if (!events || !events.length) {
      ctx.throw(400, '缺少有效参数')
      return
    }

    let result = await EventModel.remove({ '_id': { $in: events } })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "事件批量删除成功",
      data: {
        result
      }
    }
  }
}

module.exports = Event
