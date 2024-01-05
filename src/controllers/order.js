const { Cart, Product, Order, Detail, User } = require('../models')
const ApiError = require('../utils/apiError')

const createOrderByCart = async (req, res, next) => {
  try {
    const cartItems = await Cart.findAll({
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

    if (!cartItems || cartItems.length === 0) {
      return next(new ApiError('Cart is empty', 400))
    }

    const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

    const order = await Order.create({
      total_price: totalPrice,
      customer_id: req.user.id,
    })

    for (const cartItem of cartItems) {
      const { product, quantity } = cartItem

      product.stock -= quantity
      await product.save()

      await Detail.create({
        quantity,
        product_id: product.id,
        order_id: order.id,
        unit_price: product.price,
      })

      await cartItem.destroy()
    }

    res.status(200).json({
      success: true,
      message: 'Success create order',
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        customer_id: req.user.id,
      },
      include: [
        {
          model: Detail,
          attributes: {
            exclude: ['order_id', 'product_id', 'order_id'],
          },
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    })

    res.status(200).json({
      success: true,
      message: 'Success get user orders',
      data: orders,
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

const getSellerProductsOrdered = async (req, res, next) => {
  try {
    if (req.user.role !== 'seller') {
      return next(new ApiError('Only seller can access this route', 403))
    }

    const products = await Detail.findAll({
      include: [
        {
          model: Product,
          where: {
            seller_id: req.user.id,
          },
          as: 'product',
        },
        {
          model: Order,
          as: 'order_detail',
          attributes: {
            exclude: ['customer_id', 'total_price'],
          },
          include: [
            {
              model: User,
              as: 'customer',
              attributes: {
                exclude: ['password'],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ['unit_price', 'product_id', 'order_id'],
      },
    })
    res.status(200).json({
      success: true,
      message: 'Success get seller product ordered',
      data: products,
    })
  } catch (error) {
    next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createOrderByCart,
  getUserOrders,
  getSellerProductsOrdered,
}
