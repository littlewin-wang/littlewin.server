/**
 * @file routes
 * @author littlewin(littlewin.wang@gmail.com)
 */

const config = require('config/env')[process.env.NODE_ENV || 'development']
const router = require('koa-router')()
const User = require('controllers/user')
const Category = require('controllers/category')
const Tag = require('controllers/tag')
const Article = require('controllers/article')
const Comment = require('controllers/comment')
const Qiniu = require('controllers/qiniu')
const Qcloud = require('controllers/qcloud')
const Github = require('controllers/github')
const Site = require('controllers/site')
const Server = require('controllers/server')
const SiteMap = require('controllers/sitemap')
const Like = require('controllers/like')
const Event = require('controllers/event')
const Message = require('controllers/message')
const Spotify = require('controllers/spotify')
const GA = require('controllers/ga')
const middleware = require('middlewares')

router
  .get('/', (ctx) => {
    ctx.body = {
      title: "littlewin.server API",
      version: "v1",
      author: "littlewin.wang@gmail.com",
      site: "littlewin.wang",
      guide: "https://github.com/littlewin-wang/littlewin.server/blob/master/README.md"
    }
  })

  .get('/sitemap.xml', SiteMap.get)

  .post('/user', User.login)
  .get('/user', User.get)
  .put('/user', middleware.verifyToken, User.modify)

  .post('/category', middleware.verifyToken, Category.create)
  .get('/category', Category.list)
  .get('/category/:id', Category.get)
  .put('/category/:id', middleware.verifyToken, Category.modify)
  .delete('/category/:id', middleware.verifyToken, Category.delete)

  .post('/tag', middleware.verifyToken, Tag.create)
  .get('/tag', Tag.list)
  .delete('/tag', middleware.verifyToken, Tag.deleteList)
  .get('/tag/:id', Tag.get)
  .put('/tag/:id', middleware.verifyToken, Tag.modify)
  .delete('/tag/:id', middleware.verifyToken, Tag.delete)

  .post('/article', middleware.verifyToken, Article.create)
  .get('/article', Article.list)
  .patch('/article', middleware.verifyToken, Article.patch)
  .delete('/article', middleware.verifyToken, Article.deleteList)
  .get('/article/:id', Article.get)
  .put('/article/:id', middleware.verifyToken, Article.modify)
  .delete('/article/:id', middleware.verifyToken, Article.delete)

  .post('/comment', Comment.create)
  .get('/comment', Comment.list)
  .patch('/comment', middleware.verifyToken, Comment.patch)
  .delete('/comment', middleware.verifyToken, Comment.deleteList)
  .get('/comment/:id', Comment.get)
  .put('/comment/:id', middleware.verifyToken, Comment.modify)
  .delete('/comment/:id', middleware.verifyToken, Comment.delete)

  .get('/site', Site.get)
  .put('/site', middleware.verifyToken, Site.modify)

  .get('/server', Server.getServer)

  .get('/qiniu', middleware.verifyToken, Qiniu.getToken)
  .get('/qcloud', middleware.verifyToken, Qcloud.getQcloud)
  .get('/github', Github.list)

  .post('/like', Like.like)

  .get('/event', Event.list)
  .get('/event/:id', Event.get)
  .delete('/event', middleware.verifyToken, Event.deleteList)
  .delete('/event/:id', middleware.verifyToken, Event.delete)

  .get('/message', Message.list)
  .post('/message', middleware.verifyToken, Message.create)
  .put('/message/:id', middleware.verifyToken, Message.modify)
  .delete('/message/:id', middleware.verifyToken, Message.delete)
  .delete('/message', middleware.verifyToken, Message.deleteList)

  .get('/spotify', Spotify.getToken)

  .post('/ga', GA.post)

module.exports = router
