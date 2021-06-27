const db = require('../models')
const { Restaurant, Category } = db

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      order: [['updatedAt', 'DESC']]
    }).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  }
}

module.exports = adminService
