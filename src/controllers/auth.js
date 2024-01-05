const { hash, compare } = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../models')
const ApiError = require('../utils/apiError')

const customerRegister = async (req, res, next) => {
  const { email, username, password, mobile, name } = req.body

  try {
    if (!email || !username || !password || !mobile || !name) {
      return next(new ApiError('all fields are required', 400))
    }

    if (password.length < 6) {
      return next(new ApiError('password must be more than 6 characters', 400))
    }

    const findUserByEmail = await User.findOne({
      where: {
        email,
      },
    })
    if (findUserByEmail) {
      return next(new ApiError('email already exist', 400))
    }

    const findUserByUsername = await User.findOne({
      where: {
        username,
      },
    })
    if (findUserByUsername) {
      return next(new ApiError('username already exist', 400))
    }

    const hashedPassword = await hash(password, 10)

    await User.create({
      email,
      username,
      mobile,
      name,
      password: hashedPassword,
      role: 'customer',
    })

    res.status(201).json({
      success: true,
      message: 'customer account created',
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const loginCustomer = async (req, res, next) => {
  const { username, password } = req.body

  try {
    if (!username || !password) {
      return next(new ApiError('all fields are required', 400))
    }

    const findUserByUsername = await User.findOne({
      where: {
        username,
      },
    })

    if (!findUserByUsername) {
      return next(new ApiError('customer not found', 404))
    }

    const matchPassword = await compare(password, findUserByUsername.password)
    if (!matchPassword) {
      return next(new ApiError('password is incorrect', 400))
    }

    const payload = {
      id: findUserByUsername.id,
      username: findUserByUsername.username,
      email: findUserByUsername.email,
      role: findUserByUsername.role,
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: '1d',
    })

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1 * 60 * 60 * 24,
    })

    res.status(200).json({
      success: true,
      message: 'login success',
      data: {
        ...payload,
        accessToken,
      },
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const registerSeller = async (req, res, next) => {
  const user = req.user
  try {
    if (user.role === 'seller') {
      return next(new ApiError('This account has become a seller', 400))
    }

    await User.update(
      {
        role: 'seller',
      },
      {
        where: {
          id: user.id,
        },
      }
    )

    res.status(201).json({
      success: true,
      message: 'seller account created',
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const loginSeller = async (req, res, next) => {
  const { username, password } = req.body

  try {
    if (!username || !password) {
      return next(new ApiError('all fields are required', 400))
    }

    const findUserByUsername = await User.findOne({
      where: {
        username,
      },
    })

    if (!findUserByUsername || findUserByUsername.role !== 'seller') {
      return next(new ApiError('seller not found', 404))
    }

    const matchPassword = await compare(password, findUserByUsername.password)
    if (!matchPassword) {
      return next(new ApiError('password is incorrect', 400))
    }

    const payload = {
      id: findUserByUsername.id,
      username: findUserByUsername.username,
      email: findUserByUsername.email,
      role: findUserByUsername.role,
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: '1d',
    })

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1 * 60 * 60 * 24,
    })

    res.status(200).json({
      success: true,
      message: 'login success',
      data: {
        ...payload,
        accessToken,
      },
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

module.exports = {
  customerRegister,
  loginCustomer,
  registerSeller,
  loginSeller,
}
