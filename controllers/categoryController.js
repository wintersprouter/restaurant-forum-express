const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/categories')
    })
  },
  putCategory: async (req, res) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) {
      req.flash('error_messages', '請填寫名稱')
      return res.redirect('back')
    } else {
      try {
        const category = await Category.findByPk(id)
        category.update(name)
        req.flash('success_messages', '修改類別成功！')
        res.redirect('/admin/categories')
      } catch (err) {
        console.log(err)
      }
    }
  },
  deleteCategory: async (req, res) => {
    const id = req.params.id
    try {
      const category = await Category.findByPk(id)
      category.destroy()
      req.flash('success_messages', '刪除類別成功！')
      res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = categoryController
