const express = require('express')
const { customerRegister, loginCustomer, registerSeller, loginSeller } = require('../controllers/auth')
const authenticate = require('../middlewares/authentication')

const router = express.Router()

router.post('/customer-register', customerRegister)
router.post('/customer-login', loginCustomer)
router.patch('/seller-register', authenticate, registerSeller)
router.post('/seller-login', loginSeller)

const authRouter = router
module.exports = authRouter
