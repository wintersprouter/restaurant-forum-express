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
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(
      req.params.id,
      { include: [Category] }).then(restaurant => {
      return callback({ restaurant: restaurant.toJSON() })
    })
  }
}

module.exports = adminService
