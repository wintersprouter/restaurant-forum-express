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
  }
}
module.exports = categoryService
