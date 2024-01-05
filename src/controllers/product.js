const { Op } = require('sequelize')
const { Product, User } = require('../models')
const ApiError = require('../utils/apiError')

const createProduct = async (req, res, next) => {
  const { title, description, price, stock } = req.body
  try {
    if (!title || !description || !price || !stock) {
      return next(new ApiError('all fields are required', 400))
    }

    await Product.create({
      title,
      description,
      price,
      stock,
      seller_id: req.user.id,
    })

    res.status(201).json({
      success: true,
      message: 'product created',
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const updateProduct = async (req, res, next) => {
  const { title, description, price, stock } = req.body
  const { id } = req.params
  try {
    const findProduct = await Product.findOne({
      where: {
        id,
        seller_id: req.user.id,
      },
    })
    if (!findProduct) {
      return next(new ApiError('product not found or you are not owner this product', 404))
    }
    await Product.update(
      {
        title,
        description,
        price,
        stock,
        seller_id: req.user.id,
      },
      {
        where: {
          id: id,
        },
      }
    )

    res.status(200).json({
      success: true,
      message: 'product updated',
    })
  } catch {
    next(new ApiError(error.message, 500))
  }
}

const deleteProduct = async (req, res, next) => {
  const { id } = req.params
  try {
    const findProduct = await Product.findOne({
      where: {
        id,
        seller_id: req.user.id,
      },
    })
    if (!findProduct) {
      return next(new ApiError('product not found or you are not owner this product', 404))
    }

    await Product.destroy({
      where: {
        id,
        seller_id: req.user.id,
      },
    })
    res.status(200).json({
      success: true,
      message: 'product deleted',
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const getProducts = async (req, res, next) => {
  const { sellerUsername } = req.query
  try {
    let whereCondition = {}

    if (sellerUsername) {
      whereCondition = {
        username: {
          [Op.like]: `%${sellerUsername}%`,
        },
      }
    }
    const products = await Product.findAll({
      include: [
        {
          model: User,
          as: 'seller',
          attributes: {
            exclude: ['password', 'refresh_token'],
          },
          where: whereCondition,
        },
      ],
    })
    res.status(200).json({
      success: true,
      data: products,
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const getProduct = async (req, res, next) => {
  const { id } = req.params
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: {
            exclude: ['password', 'refresh_token'],
          },
        },
      ],
    })
    if (!product) {
      return next(new ApiError('product not found', 404))
    }

    res.status(200).json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
}
