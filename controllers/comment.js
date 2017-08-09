/**
 * @file 评论控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const CommentModel = require('models/comment.model')

class Comment {
  static async create (ctx) {
    const comment = ctx.request.body

    // TODO nginx反向代理, 通过
    // proxy_set_header X-Real-IP $remote_addr
    // 将客户端真实ip地址放到header的x-real-ip字段，然后直接从这个字段来取客户端的ip地址

    // TODO GET评论ip，并根据ip解析出location

    comment.likes = 0
    comment.isTop = false
    comment.agent = ctx.header['user-agent'] || comment.agent

    // TODO 增加过滤机制
    let result = await new CommentModel(comment).save()

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "评论发布成功",
      body: {
        result
      }
    }
  }
}

module.exports = Comment
