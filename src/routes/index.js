const express = require('express')
const authRouter = require('./auth')
const productRouter = require('./product')
const cartRouter = require('./cart')
const orderRouter = require('./order')

const router = express.Router()

router.use('/api/v1/auths', authRouter)
router.use('/api/v1/products', productRouter)
router.use('/api/v1/carts', cartRouter)
router.use('/api/v1/orders', orderRouter)

module.exports = router
