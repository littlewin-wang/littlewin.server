/**
 * @file 评论控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const CommentModel = require('models/comment.model')

class Comment {
  static async list (ctx) {
    let { sort = -1, page, per_page, keyword = '', postID, state } = ctx.query

    sort = Number(sort)

    // filter options
    const options ={
      sort: { _id: -1 },
      page: Number(page || 1),
      limit: Number(per_page || 40)
    }

    // sort field
    if ([1, -1].includes(sort)) {
      options.sort = { _id: sort }
    } else if (Object.is(sort, 2)) {
      options.sort = { likes: -1 }
    }

    // 查询参数
    let querys = {}

    // 按照state查询
    if (['0', '1', '-1', '-2'].includes(state)) {
      querys.state = state
    }

    // 关键词查询
    if (keyword) {
      const keywordReg = new RegExp(keyword);
      querys['$or'] = [
        { 'content': keywordReg },
        { 'author.name': keywordReg },
        { 'author.email': keywordReg }
      ]
    }

    // postID查询
    if (!Object.is(postID, undefined)) {
      querys.postID = postID
    }
    
    const comments = await CommentModel.paginate(querys, options)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "评论列表获取成功",
      data: {
        comments: comments.docs,
        total: comments.total,
        limit: comments.limit,
        page: comments.page,
        pages: comments.pages
      }
    }
  }

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
