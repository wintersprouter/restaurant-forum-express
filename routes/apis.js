const express = require('express')
const router = express.Router()
const multer = require('multer')

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController')

const upload = multer({
  dest: 'temp/',
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(null, false, req.flash('error_messages', '請上傳正確圖片格式！'))
    }
    cb(null, true)
  },
  limits: {
    fileSize: 1000000,
    files: 1
  }
})

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurant/:id', adminController.getRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)

router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategory)
router.put('/admin/categories/:id', categoryController.putCategory)

module.exports = router
