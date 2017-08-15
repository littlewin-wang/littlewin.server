/**
 * @file 评论控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const CommentModel = require('models/comment.model')
const ArticleModel = require('models/article.model')

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

  // 批量修改评论state (0待审核/ 1通过正常/ -1已删除/ -2垃圾评论)
  static async patch (ctx) {
    let { comments, postIDs, state } = ctx.request.body
    state = Object.is(state, undefined) ? null : Number(state)

    // 验证comments
    if (!comments || !comments.length || Object.is(state, null) || Object.is(state, NaN) || ![-1, -2, 0, 1].includes(state)) {
      ctx.throw(401, '参数不对')
      return
    }

    let result = await CommentModel.update({ '_id': { $in: comments }}, { $set: { state } }, { multi: true })
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "评论批量更新成功"
    }
  }

  static async deleteList (ctx) {
    const { comments } = ctx.request.body

    if (!comments || !comments.length) {
      ctx.throw(401, '缺少有效参数')
      return
    }

    await CommentModel.remove({ '_id': { $in: comments }})

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "批量删除评论成功",
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

    if (result.postID) {
      // 发表comment后更新article的meta.comments值
      let comments = await CommentModel.aggregate([
        { $match: { state: 1, postID: result.postID}},
        { $group: { _id: "$postID", num_tutorial: { $sum : 1 }}}
      ])

      for (let item of comments) {
        await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial }})
      }
    }

    ctx.status = 200,
    ctx.body = {
      success: true,
      message: "评论发布成功",
      data: {
        result
      }
    }
  }

  static async get (ctx) {
    const id = ctx.params.id

    let result = await CommentModel.findById(id)

    // 是否查找到
    if (!result) {
      ctx.throw(401, "评论获取失败")
      return
    }

    // 成功回应
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "评论获取成功",
      result
    }
  }

  static async modify (ctx) {
    const id = ctx.params.id
    const comment = ctx.request.body

    let result = await CommentModel.findByIdAndUpdate(id, comment, { new: true })

    if (result.postID) {
      let comments = await CommentModel.aggregate([
        { $match: { state: 1, postID: result.postID}},
        { $group: { _id: "$postID", num_tutorial: { $sum : 1 }}}
      ])

      for (let item of comments) {
        await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial }})
      }
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "评论修改成功",
      result
    }
  }

  static async delete (ctx) {
    const id = ctx.params.id

    let isExist = await CommentModel
      .findOne({_id: id})

    if (!isExist) {
      ctx.status = 401,
        ctx.body = {
          success: false,
          message: "评论ID不存在"
        }
      return
    }

    await CommentModel.findByIdAndRemove(id)

    if (isExist.postID) {
      let comments = await CommentModel.aggregate([
        { $match: { state: 1, postID: isExist.postID}},
        { $group: { _id: "$postID", num_tutorial: { $sum : 1 }}}
      ])

      if (comments.length === 0) {
        await ArticleModel.update({ id: isExist.postID }, { $set: { 'meta.comments': 0 }})
      } else {
        for (let item of comments) {
          await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial }})
        }
      }
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      message: "评论删除成功",
    }
  }
}

module.exports = Comment
