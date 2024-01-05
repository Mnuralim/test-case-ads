const express = require('express')
const { createCart, getUserCart, emptyCart } = require('../controllers/cart')
const authenticate = require('../middlewares/authentication')

const router = express.Router()

router.post('/', authenticate, createCart)
router.get('/', authenticate, getUserCart)
router.delete('/', authenticate, emptyCart)

const cartRouter = router
module.exports = cartRouter
