const db = require('../models')
const { Restaurant, User, Category } = db
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        order: [['updatedAt', 'DESC']]
      })

      return res.render('admin/restaurants', { restaurants: restaurants })
    } catch (err) {
      console.log(err)
    }
  },

  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { categories: categories })
    } catch (err) {
      console.log(err)
    }
  },

  postRestaurant: async (req, res) => {
    try {
      const { name, tel, address, opening_hours, description, categoryId } = req.body
      if (!name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          try {
            await Restaurant.create({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : null,
              CategoryId: categoryId
            })
            req.flash('success_messages', 'restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          } catch (err) {
            console.log(err)
          }
        })
      } else {
        await Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: null,
          CategoryId: categoryId
        })
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.log(err)
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(
        req.params.id, {
          include: [Category]
        })
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      console.log(err)
    }
  },

  editRestaurant: async (req, res) => {
    try {
      const [categories, restaurant] = await Promise.all([
        Category.findAll({ raw: true, nest: true }),
        Restaurant.findByPk(req.params.id)
      ])
      return res.render('admin/create', {
        categories: categories,
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      console.log(err)
    }
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId,
              updatedAt: new Date()
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId,
            updatedAt: new Date()
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },
  getUsers: (req, res) => {
    return User.findAll({
      raw: true,
      nest: true,
      order: [['updatedAt', 'DESC']]
    }).then(users => {
      return res.render('admin/users', {
        users: users
      })
    })
      .catch(() => { res.sendStatus(404) })
  },
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        return user.update({
          updatedAt: new Date(),
          isAdmin: user.isAdmin ? 0 : 1
        })
          .then((user) => {
            req.flash('success_messages', `${user.name}的權限已成功更新`)
            return res.redirect('/admin/users')
          })
          .catch(() => {
            req.flash('error_messages', '權限更新失敗！')
            return res.redirect('/admin/users')
          })
      })
  }
}

module.exports = adminController
