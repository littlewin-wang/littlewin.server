/**
 * @file 管理后台分类接口逻辑层
 * @author littlewin(littlewin.wang@gmail.com)
 */

import mongoose from 'mongoose'
const { CategoryModel, TopCategoryModel } = require('../../models/index')

class BackendCategory {
  // 创建一级分类
  static async create_top_cate (ctx) {
    const data = ctx.request.body
    const top_cate_name = data.top_cate_name

    // 信息填写错误
    if (!data || !top_cate_name) {
      return ctx.render('error', {
        message: '信息错误',
        error: {
          status: 404
        }
      })
    }

    // 信息分类已存在
    const isExist = await TopCategoryModel.findOne({ top_cate_name })
    if (isExist) {
      return ctx.render('error', {
        message: '该分类已存在',
        error: {
          status: 400
        }
      })
    }

    const result = await TopCategoryModel.create(data)
    ctx.redirect('back')
  }

  // 创建二级分类
  static async create_sub_cate (ctx) {
    const data = ctx.request.body
    const cate_name = data.cate_name

    // 信息填写错误
    if (!data || !cate_name) {
      return ctx.render('error', {
        message: '信息错误',
        error: {
          status: 404
        }
      })
    }

    // 信息分类已存在
    const isExist = await CategoryModel.findOne({ cate_name })
    if (isExist) {
      return ctx.render('error', {
        message: '该分类已存在',
        error: {
          status: 400
        }
      })
    }

    const result = await CategoryModel.create(data)
    ctx.redirect('back')
  }

  // 编辑一级分类
  static async put_top_cate (ctx) {
    const { id, top_cate_name } = ctx.request.body

    // 信息为空
    if (!id || !top_cate_name) {
      return ctx.render('error', {
        message: '信息不能为空',
        error: {
          status: 404
        }
      })
    }

    const result = await TopCategoryModel.findByIdAndUpdate(id, { top_cate_name })
    ctx.redirect('back')
  }

  // 编辑二级分类
  static async put_sub_cate (ctx) {
    const { cate_id, cate_name, cate_info, cate_parent } = ctx.request.body

    // 信息为空
    if (!cate_id || !cate_name || !cate_info || !cate_parent) {
      return ctx.render('error', {
        message: '信息不能为空',
        error: {
          status: 404
        }
      })
    }

    const result = await CategoryModel.findByIdAndUpdate(cate_id, { cate_name, cate_info, cate_parent })
    ctx.redirect('back')
  }

  // 删除分类
  static async delete_cate (ctx) {
    const { model, type } = ctx.query
    const { id } = ctx.params

    // 参数错误
    if(!id || !model) return ctx.render('error',{
      message: '参数错误',
      error: { status:400 }
    })

    const result = await mongoose.model(model).findByIdAndRemove(id)
    ctx.redirect('back')
  }
}

export default BackendCategory
