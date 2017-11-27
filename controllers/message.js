/**
 * @file 个人消息控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const MessageModel = require('models/message.model')

class Message {
  static async list (ctx) {
    let { page = 1, per_page = 10, state, keyword = '' } = ctx.query

    // 过滤条件
    const options = {
      sort: { createAt: -1 },
      page: Number(page),
      limit: Number(per_page)
    }

    // 查询参数
    const query = {
      'content': new RegExp(keyword)
    }

    // 按照type查询
    if (['0', '1'].includes(state)) {
      query.state = state
    } else {
      query.state = 1
    }

    const messages = await MessageModel.paginate(query, options)

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "获取个人公告列表",
      data: {
        messages: messages.docs,
        total: messages.total,
        limit: messages.limit,
        page: messages.page,
        pages: messages.pages
      }
    }
  }

  static async create (ctx) {
    const message = ctx.request.body

    await new MessageModel(message).save()
      .then(() => {
        ctx.status = 200
        ctx.body = {
          success: true,
          message: "公告发布成功"
        }
      })
      .catch(() => {
        ctx.throw(400, '公告发布失败')
      })
  }

  static async modify (ctx) {
    const message = ctx.request.body
    const id = ctx.params.id

    // content validate
    if (!message.content) {
      ctx.throw(400, '公告内容为空')
      return
    }

    let messageItem = await MessageModel.findByIdAndUpdate(id, message, { new: true })

    if (!messageItem) {
      ctx.throw(404, '公告ID不存在')
    } else {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: "公告更新成功",
        data: {
          message: messageItem
        }
      }
    }
  }

  static async delete (ctx) {
    const id = ctx.params.id

    let isExist = await MessageModel.findOne({ _id: id })

    if (!isExist) {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: "公告ID不存在"
      }
      return
    }

    await MessageModel.remove({ _id: id })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "公告删除成功"
    }
  }

  static async deleteList (ctx) {
    const { messages } = ctx.request.body

    if (!messages || !messages.length) {
      ctx.throw(400, '缺少有效参数')
      return
    }

    let result = await MessageModel.remove({ '_id': { $in: messages } })

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "公告批量删除成功",
      data: {
        result
      }
    }
  }
}

module.exports = Message
