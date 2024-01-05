const jwt = require('jsonwebtoken')
const { User } = require('../models')
const ApiError = require('../utils/apiError')

const authenticate = async (req, res, next) => {
  const bearerToken = req.headers.authorization
  if (!bearerToken) {
    return next(new ApiError('Unauthorized, Login please!', 401))
  }
  const token = bearerToken.split(' ')[1]
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findByPk(payload.id, {
    attributes: { exclude: ['password', 'refresh_token'] },
  })
  req.user = user
  next()
}

module.exports = authenticate
