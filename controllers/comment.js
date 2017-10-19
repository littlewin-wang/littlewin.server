/**
 * @file 评论控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const CommentModel = require('models/comment.model')
const ArticleModel = require('models/article.model')
const SiteModel = require('models/site.model')

const { akismetClient } = require('utils/akismet');
const { sendMail } = require('utils/email')
const marked = require('marked')
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})
const geoip = require('geoip-lite')

// 邮件通知网站主及目标对象
const sendMailToAdminAndReply = (comment, permalink) => {
  const commentContent = marked(comment.content)
  sendMail({
    to: 'littlewin.wang@gmail.com',
    subject: '博客有新的留言',
    text: `来自 ${comment.author.name} 的留言：${comment.content}`,
    html: `<p> 来自 ${comment.author.name} 的留言：${commentContent}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
  })
  if (!!comment.pid) {
    CommentModel.findOne({ id: comment.pid }).then(parentComment => {
      sendMail({
        to: parentComment.author.email,
        subject: '你在littlewin.wang有新的评论回复',
        text: `来自 ${comment.author.name} 的评论回复：${comment.content}`,
        html: `<p> 来自${comment.author.name} 的评论回复：${commentContent}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
      })
    })
  }
}

class Comment {
  static async list (ctx) {
    let { sort = -1, page, per_page, keyword = '', postID, state } = ctx.query

    sort = Number(sort)

    // filter options
    const options = {
      sort: { createAt: -1 },
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
    if (!Object.is(postID, '') && !Object.is(postID, undefined)) {
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
    let { comments, state } = ctx.request.body
    state = Object.is(state, undefined) ? null : Number(state)

    // 验证comments
    if (!comments || !comments.length || Object.is(state, null) || Object.is(state, NaN) || ![-1, -2, 0, 1].includes(state)) {
      ctx.throw(401, '参数不对')
      return
    }

    let postIDs = []

    for (let comment of comments) {
      let result = await CommentModel.findById(comment._id)
      postIDs.push(result.postID)
    }

    let result = await CommentModel.update({ '_id': { $in: comments } }, { $set: { state } }, { multi: true })

    for (let id of postIDs) {
      if (id) {
        let comments = await CommentModel.aggregate([
          { $match: { state: 1, postID: id } },
          { $group: { _id: "$postID", num_tutorial: { $sum: 1 } } }
        ])

        if (comments.length === 0) {
          await ArticleModel.update({ id: id }, { $set: { 'meta.comments': 0 } })
        } else {
          for (let item of comments) {
            await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial } })
          }
        }
      }
    }

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

    let postIDs = []

    for (let comment of comments) {
      let result = await CommentModel.findById(comment._id)
      postIDs.push(result.postID)
    }

    await CommentModel.remove({ '_id': { $in: comments } })

    for (let id of postIDs) {
      if (id) {
        let comments = await CommentModel.aggregate([
          { $match: { state: 1, postID: id } },
          { $group: { _id: "$postID", num_tutorial: { $sum: 1 } } }
        ])

        if (comments.length === 0) {
          await ArticleModel.update({ id: id }, { $set: { 'meta.comments': 0 } })
        } else {
          for (let item of comments) {
            await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial } })
          }
        }
      }
    }

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
    const ip = (ctx.header['x-forwarded-for'] || ctx.header['x-real-ip'] || ctx.ip || ctx.ips[0])

    const ip_location = geoip.lookup(ip)

    if (ip_location) {
      comment.ip_location = {
        city: ip_location.city,
        range: ip_location.range,
        country: ip_location.country
      }
    }
    comment.ip = ip
    comment.likes = 0
    comment.isTop = false
    comment.agent = ctx.header['user-agent'] || comment.agent

    // 永久链接
    const permalink = 'http://littlewin.wang/' + (Object.is(comment.postID, 0) ? 'guest' : `article/${comment.postID}`)

    // 使用akismet过滤
    let akismetCheck = await akismetClient.checkSpam({
      user_ip: comment.ip,
      user_agent: comment.agent,
      referrer: ctx.header.referer,
      permalink,
      comment_type: 'comment',
      comment_author: comment.author.name,
      comment_author_email: comment.author.email,
      comment_author_url: comment.author.site,
      comment_content: comment.content,
      is_test: Object.is(process.env.NODE_ENV, 'development')
    })

    if (akismetCheck) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "评论未通过akismet验证"
      }
      return
    }

    // 使用设置的黑名单过滤
    let site = await SiteModel.findOne()
    const { keywords, mails, ips } = site.blacklist
    if (ips.includes(comment.ip) || mails.includes(comment.author.email) || (keywords.length && eval(`/${keywords.join('|')}/ig`).test(comment.content))) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "IP或Email被ban || 评论内容不当"
      }
      return
    }

    let result = await new CommentModel(comment).save()

    if (result.postID) {
      // 发表comment后更新article的meta.comments值
      let comments = await CommentModel.aggregate([
        { $match: { state: 1, postID: result.postID } },
        { $group: { _id: "$postID", num_tutorial: { $sum: 1 } } }
      ])

      for (let item of comments) {
        await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial } })
      }
    }

    sendMailToAdminAndReply(comment, permalink)
    ctx.status = 200
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

    let before = await CommentModel.findById(id)
    let result = await CommentModel.findByIdAndUpdate(id, comment, { new: true })

    // 更新修改前的postID对应的meta.comments值
    if (before.postID) {
      let comments = await CommentModel.aggregate([
        { $match: { state: 1, postID: before.postID } },
        { $group: { _id: "$postID", num_tutorial: { $sum: 1 } } }
      ])

      if (comments.length === 0) {
        await ArticleModel.update({ id: before.postID }, { $set: { 'meta.comments': 0 } })
      } else {
        for (let item of comments) {
          await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial } })
        }
      }
    }

    // 更新修改后的postID对应的meta.comments值
    if (result.postID) {
      let comments = await CommentModel.aggregate([
        { $match: { state: 1, postID: result.postID } },
        { $group: { _id: "$postID", num_tutorial: { $sum: 1 } } }
      ])

      for (let item of comments) {
        await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial } })
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
      .findOne({ _id: id })

    if (!isExist) {
      ctx.status = 401
      ctx.body = {
        success: false,
        message: "评论ID不存在"
      }
      return
    }

    await CommentModel.findByIdAndRemove(id)

    if (isExist.postID) {
      let comments = await CommentModel.aggregate([
        { $match: { state: 1, postID: isExist.postID } },
        { $group: { _id: "$postID", num_tutorial: { $sum: 1 } } }
      ])

      if (comments.length === 0) {
        await ArticleModel.update({ id: isExist.postID }, { $set: { 'meta.comments': 0 } })
      } else {
        for (let item of comments) {
          await ArticleModel.update({ id: item._id }, { $set: { 'meta.comments': item.num_tutorial } })
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
