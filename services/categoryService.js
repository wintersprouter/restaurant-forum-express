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
  }
}
module.exports = categoryService
