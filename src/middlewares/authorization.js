const ApiError = require('../utils/apiError')

const authorization = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new ApiError(`acccess forbidden, your role is not ${role}`, 403))
    }
    next()
  }
}

module.exports = authorization
