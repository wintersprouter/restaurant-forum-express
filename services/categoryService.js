const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    const id = req.params.id
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (id) {
          Category.findByPk(id).then(category => {
            return res.render('admin/categories', { categories: categories, category: category.toJSON() })
          })
        } else {
          return callback({ categories })
        }
      })
  },
  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: '請輸入類別名稱' })
    } else {
      return Category.create({
        name: name
      })
        .then((category) => {
          callback({ status: 'success', message: 'category was successfully created' })
        })
    }
  },
  putCategory: (req, res, callback) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) {
      return callback({ status: 'error', message: '請輸入類別名稱' })
    } else {
      Category.findByPk(id).then(
        (category) => {
          category.update(name)
        }).then((category) => {
        callback({ status: 'success', message: 'category was successfully update' })
      })
    }
  },
  deleteCategory: (req, res, callback) => {
    const id = req.params.id
    Category.findByPk(id).then(
      (category) => {
        category.destroy()
        callback({ status: 'success', message: 'category was successfully delete' })
      }
    )
  }
}
module.exports = categoryService
