## littlewin.server
[![](https://img.shields.io/badge/product-Koa-brightgreen.svg?style=flat-square)](https://github.com/koajs/koa)
[![](https://img.shields.io/badge/design-Restful-blue.svg?style=flat-square)](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

A restful blog backend server based on [koa](https://github.com/koajs/koa) + [mongoose](http://mongoosejs.com/).

## 调试开发
1. 开启Mongdb数据库
2. 新建一个存放密码信息的文件至'~/key/littlewin-server' - 参考[密码信息数据结构](https://github.com/littlewin-wang/littlewin.server/wiki/%E5%AF%86%E9%92%A5%E6%95%B0%E6%8D%AE%E6%96%87%E4%BB%B6)

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:8090 （需全局安装nodemon）
$ npm run dev

# product mode
$ npm start
$ pm2 start ecosystem.config.js
```

## 数据模型设计
#### 文章模型
```
{
  title: { type: String, required: true, validate: /\S+/ },    // 文章标题
  keywords: [{ type: String }],    // 文章关键词
  description: String,     // 描述
  content: { type: String, required: true, validate: /\S+/ },    // 文章内容
  thumb: String,    // 缩略图
  state: { type: Number, default: 1 },    // 文章发布状态 => -1回收站，0草稿，1已发布
  pub: { type: Number, default: 1 },    // 文章公开状态 = // -1私密，0需要密码，1公开
  password: { type: String, default: '' },    // 文章密码 => 加密状态生效
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],    // 文章标签
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },    // 文章分类
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },    // 其他元信息
  createAt: { type: Date, default: Date.now },    // 创建时间
  updateAt: { type: Date },    // 修改时间
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]    // 扩展属性
})
```

#### 分类模型 
```
{
  name: { type: String, required: true, validate: /\S+/ },    // 分类名称 
  description: String,    // 描述
  super: { type: Schema.Types.ObjectId, ref: 'Category' },    // 父分类
  createAt: { type: Date, default: Date.now },    // 创建时间
  updateAt: { type: Date },    // 修改时间
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]     // 扩展属性
}
```

#### 标签模型
```
{
  name: { type: String, required: true, validate: /\S+/ },    // 标签名称
  description: String,    // 描述
  createAt: { type: Date, default: Date.now },    // 创建时间
  updateAt: { type: Date },    // 修改时间
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]    // 扩展属性
}
```

#### 评论模型
```
{
  thirdID: { type: Number },    // 第三方评论id
  postID: { type: Number, required: true },    // 评论所在文章id， 0代表系统留言板
  pid: { type: Number, default: 0 },    // pid, 0代表默认留言
  content: { type: String, required: true, validate: /\S+/ },    // content
  isTop: { type: Boolean, default: false },    // 是否置顶
  likes: { type: Number, default: 0 },    // 点赞数
  author: {
    name: { type: String, required: true, validate: /\S+/ },
    email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },
    site: { type: String, validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ }
  },    // 评论产生者
  ip: { type: String },    // IP地址
  ip_location: { type: Object },    // ip物理地址
  agent: { type: String, validate: /\S+/ },    // 用户ua
  state: { type: Number, default: 1 },    // 状态 0待审核/1通过正常/-1已删除/-2垃圾评论
  createAt: { type: Date, default: Date.now },    // 创建时间
  updateAt: { type: Date },    // 修改时间
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]    // 扩展属性
}
```

#### 用户模型
```
{
  username: { type: String, default: '' },    // 用户名
  password: {
    type: String,
    default: md5(config.AUTH.default.password)
  },    // 密码
  slogan: { type: String, default: '' },    // 签名
  gravatar: { type: String, default: '' },    // 头像
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]    // 扩展属性
}
```

#### 站点信息模型
```
{
  title: { type: String, required: true },    // 网站标题
  sub_title: { type: String, required: true },    // 网站副标题
  keywords: [{ type: String }],    // 关键字
  description: String,    // 网站描述
  site_url: { type: String, required: true },    // 站点地址
  site_email: String,    // 网站官邮
  site_icp: String,    // 备案号
  links: [{ title: String, site: String, description: String }],    // 友链
  blacklist: {
    ips: [{ type: String, validate: /\S+/ }],
    mails: [{ type: String, validate: /\S+/ }],
    keywords: [{ type: String, validate: /\S+/ }]
  },    // 黑名单
  meta: {
    // 被喜欢次数
    likes: { type: Number, default: 0 }
  }    // 其他元信息
}
```

## 接口设计
#### 接口数据结构
- HTTP状态码
  * 401 权限不足或其他数据错误
  * 404 项目中不存在
  * 500 服务器挂了
  * 200 正常

- 数据特征码
  * success:
    * true
    * false
  * message:
    具体信息
  * data:
    具体数据
    
#### 接口列表
```
.get('/', (ctx) => {
    ctx.body = {
      title: "littlewin.server API",
      version: "v1",
      author: "littlewin.wang@gmail.com",
      site: "littlewin.wang",
      guide: "https://github.com/littlewin-wang/littlewin.server/blob/master/README.md"
    }
  })    // 获取API接口信息

  .get('/sitemap.xml', SiteMap.get)    // 获取sitemap信息

  .post('/user', User.login)    // 用户登录
  .get('/user', User.get)    // 获取用户信息
  .put('/user', middleware.verifyToken, User.modify)    // 更新用户信息

  .post('/category', middleware.verifyToken, Category.create)    // 新建分类
  .get('/category', Category.list)    // 获取分类列表
  .get('/category/:id', Category.get)    // 获取单个分类信息
  .put('/category/:id', middleware.verifyToken, Category.modify)    // 更新单个分类信息
  .delete('/category/:id', middleware.verifyToken, Category.delete)    // 删除单个分类

  .post('/tag', middleware.verifyToken, Tag.create)    // 新建标签
  .get('/tag', Tag.list)    // 获取标签列表
  .delete('/tag', middleware.verifyToken, Tag.deleteList)    // 批量删除标签
  .get('/tag/:id', Tag.get)    // 获取单个标签信息
  .put('/tag/:id', middleware.verifyToken, Tag.modify)    // 更新单个标签信息
  .delete('/tag/:id', middleware.verifyToken, Tag.delete)    // 删除单个标签
  
  .post('/article', middleware.verifyToken, Article.create)    // 新建文章
  .get('/article', Article.list)    // 获取文章列表
  .patch('/article', middleware.verifyToken, Article.patch)    // 批量更新文章
  .delete('/article', middleware.verifyToken, Article.deleteList)    // 批量删除文章
  .get('/article/:id', Article.get)    // 获取单个文章信息
  .put('/article/:id', middleware.verifyToken, Article.modify)    // 更新单个文章信息
  .delete('/article/:id', middleware.verifyToken, Article.delete)    // 删除单个文章
  
  .post('/comment', Comment.create)    // 新建评论
  .get('/comment', Comment.list)    // 获取评论列表
  .patch('/comment', middleware.verifyToken, Comment.patch)    // 批量更新评论状态
  .delete('/comment', middleware.verifyToken, Comment.deleteList)    // 批量删除评论
  .get('/comment/:id', Comment.get)    // 获取单个评论信息
  .put('/comment/:id', middleware.verifyToken, Comment.modify)    // 更新单个评论信息
  .delete('/comment/:id', middleware.verifyToken, Comment.delete)    // 删除单个评论
  
  .post('/like', Like.like)    // 点赞

  .get('/site', Site.get)    // 获取站点信息
  .put('/site', middleware.verifyToken, Site.modify)    // 更新站点信息
```

## Feature list
 - [x] 文章/分类/标签/评论等 数据模型设计
 - [x] 文章/分类/标签/评论等 接口设计
 - [x] 增加extends属性
 - [x] 非GET请求验证token
 - [x] 增加评论过滤机制
 - [x] 增加评论邮件提醒功能
 - [x] 根据IP解析地址
 - [x] 生成SITEMAP
 - [x] 自动push新链到百度
 - [x] 启用redis
 - [ ] 启用SSL

## Contact
Email: [littlewin.wang@gmail.com](mailto:littlewin.wang@gmail.com)
