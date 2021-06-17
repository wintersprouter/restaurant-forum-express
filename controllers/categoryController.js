const db = require('../models')
const Category = db.Category
const categoryController = {
  getCategories: async (req, res) => {
    try {
      const id = req.params.id
      const categories = await Category.findAll({ raw: true, nest: true })
      if (id) {
        const category = await Category.findByPk(id)
        return res.render('admin/categories', {
          categories,
          category: category.toJSON()
        })
      } else {
        return res.render('admin/categories', { categories })
      }
    } catch (err) {
      console.log(err)
    }
  },
  postCategory: async (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '請填寫名稱')
      return res.redirect('back')
    } else {
      try {
        await Category.create({ name })
        req.flash('success_messages', '新增類別成功！')
        res.redirect('/admin/categories')
      } catch (err) {
        console.log(err)
      }
    }
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
