const express = require('express')
const authenticate = require('../middlewares/authentication')
const { getUserOrders, getSellerProductsOrdered, createOrderByCart } = require('../controllers/order')

const router = express.Router()

router.post('/', authenticate, createOrderByCart)
router.get('/', authenticate, getUserOrders)
router.get('/seller', authenticate, getSellerProductsOrdered)

const orderRouter = router
module.exports = orderRouter
