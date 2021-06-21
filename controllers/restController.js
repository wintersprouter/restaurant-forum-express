const db = require('../models')
const { Restaurant, Category, Comment, User } = db
const helpers = require('../_helpers')
const pageLimit = 10

const restController = {
  getRestaurants: async (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    try {
      const [result, categories] = await Promise.all([Restaurant.findAndCountAll({
        include: Category,
        where: whereQuery,
        offset: offset,
        limit: pageLimit
      }), Category.findAll({ raw: true, nest: true })])

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))

      res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        page,
        totalPage,
        prev,
        next
      })
    } catch (err) {
      console.log(err)
    }
  },

  getRestaurant: async (req, res) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited
      })
    } catch (err) {
      console.log(err)
    }
  },
  getFeeds: async (req, res) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [Category]
        }),
        Comment.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
        })])
      res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = restController
