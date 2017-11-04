/**
 * @file 喜欢控制
 * @author littlewin(littlewin.wang@gmail.com)
 */

const ArticleModel = require('models/article.model')
const CommentModel = require('models/comment.model')
const SiteModel = require('models/site.model')
const EventModel = require('models/event.model')

class Like {
  static async like (ctx) {
    const { id, type }  = ctx.request.body

    // type { 1: 评论, 2: 页面 }
    if (![1, 2].includes(type)) {
      ctx.throw(400, 'type参数不对，请按照{ 1: 评论, 2: 页面 }设置')
    }

    // 根据type和id找出对象
    let result = await (Object.is(type, 1) ? CommentModel : Object.is(id, 0) ? SiteModel : ArticleModel).findOne((() => (Object.is(id, 0)) ? {} : { id })())

    if (Object.is(type, 1)) {
      result.likes ++
    } else {
      result.meta.likes ++
    }

    let ret = await result.save()
    ctx.status = 200
    ctx.body = {
      success: true,
      message: "喜欢+1",
      data: {
        result: ret
      }
    }

    // event system push
    new EventModel({
      person: '某人',
      action: 'LIKE',
      target: {
        type: (Object.is(type, 1) ? 'COMMENT' : Object.is(id, 0) ? 'SITE' : 'ARTICLE'),
        data: ret
      }
    }).save()
  }
}

module.exports = Like
