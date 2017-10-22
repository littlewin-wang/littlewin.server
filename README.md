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

## 接口设计

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
 - [ ] 自动PUSH RSS
 - [ ] 启用SSL
 - [ ] redis启用

## Contact
Email: [littlewin.wang@gmail.com](mailto:littlewin.wang@gmail.com)
