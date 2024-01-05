const { Cart, Product, User } = require('../models')
const ApiError = require('../utils/apiError')

const createCart = async (req, res, next) => {
  const { productId, quantity } = req.body
  try {
    const findUserCart = await Cart.findAll({
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
        },
      ],
    })

    const product = await Product.findByPk(productId)
    if (!product) {
      return next(new ApiError('Product not found', 404))
    }

    if (product.stock < quantity) {
      return next(new ApiError('Product out of stock', 400))
    }

    const alreadyAddToCart = findUserCart.find((el) => el.product_id === productId)

    if (alreadyAddToCart) {
      alreadyAddToCart.quantity += quantity
      if (product.stock < alreadyAddToCart.quantity) {
        return next(new ApiError('Product out of stock', 400))
      }

      await alreadyAddToCart.save()
      return res.status(200).json({
        success: true,
        message: 'Product quantity updated in cart',
      })
    }

    await Cart.create({
      quantity,
      product_id: productId,
      customer_id: req.user.id,
    })

    res.status(200).json({
      success: true,
      message: 'Success add product to cart',
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const getUserCart = async (req, res, next) => {
  try {
    const data = await Cart.findAll({
      where: {
        customer_id: req.user.id,
      },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    })
    console.log(data.id)
    res.status(200).json({
      success: true,
      message: 'Success get user cart',
      data,
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const emptyCart = async (req, res, next) => {
  try {
    await Cart.destroy({
      where: {
        customer_id: req.user.id,
      },
    })
    res.status(200).json({
      success: true,
      message: 'Success empty cart',
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createCart,
  getUserCart,
  emptyCart,
}
