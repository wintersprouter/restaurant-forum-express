const db = require('../models') 
const Restaurant = db.Restaurant
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const helpers = require('../_helpers')

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({raw: true, order: [['updatedAt', 'DESC']]}).then(restaurants => {
      return res.render('admin/restaurants', {restaurants: restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
  if(!req.body.name){
    req.flash('error_messages', "name didn't exist")
    return res.redirect('back')
  }

  const { file } = req
  if (file) {
    imgur.setClientID(IMGUR_CLIENT_ID);
    imgur.upload(file.path, (err, img) => {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: file ? img.data.link : null,
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    })
  }
  else {
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description,
      image: null
    }).then((restaurant) => {
      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    })
  }
},

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw:true}).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw:true}).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant } )
    })
  },

  putRestaurant: (req, res) => {
  if(!req.body.name){
    req.flash('error_messages', "name didn't exist")
    return res.redirect('back')
  }

  const { file } = req
  if (file) {
    imgur.setClientID(IMGUR_CLIENT_ID);
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
            updatedAt: new Date()
          })
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    })
  }
  else {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image,
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
    return User.findAll({raw: true, order: [['updatedAt', 'DESC']]}).then( users => {
      return res.render('admin/users', {
        users: users 
      })
    })
    .catch(() => { res.sendStatus(404) })
  },
  toggleAdmin: (req,res) => {
    return User.findByPk(req.params.id)
    .then((user)=>{
      return user.update({ 
          updatedAt: new Date(),
          isAdmin: user.isAdmin ? 0 : 1})
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