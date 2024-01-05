const express = require('express')
const authenticate = require('../middlewares/authentication')
const { createProduct, updateProduct, deleteProduct, getProduct, getProducts } = require('../controllers/product')
const authorization = require('../middlewares/authorization')

const router = express.Router()

router.get('/', getProducts)
router.post('/', authenticate, authorization('seller'), createProduct)
router.patch('/:id', authenticate, authorization('seller'), updateProduct)
router.delete('/:id', authenticate, authorization('seller'), deleteProduct)
router.get('/:id', getProduct)

const productRouter = router
module.exports = productRouter
