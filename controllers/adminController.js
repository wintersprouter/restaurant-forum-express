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

  putRestaurant: async (req, res) => {
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
            const restaurant = await Restaurant.findByPk(req.params.id)
            await restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId,
              updatedAt: new Date()
            })

            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          } catch (err) {
            console.log(err)
          }
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: restaurant.image,
          CategoryId: categoryId,
          updatedAt: new Date()
        })
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.log(err)
    }
  },
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (err) {
      console.log(err)
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true,
        order: [['updatedAt', 'DESC']]
      })
      return res.render('admin/users', { users: users })
    } catch (err) {
      console.log(err)
    }
  },
  toggleAdmin: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      const adminId = helpers.getUser(req).id
      if (adminId === user.id) {
        return res.redirect('/admin/users')
      }
      await user.update({ updatedAt: new Date(), isAdmin: user.isAdmin ? 0 : 1 })
      req.flash('success_messages', `${user.name}的權限已成功更新`)
      res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
