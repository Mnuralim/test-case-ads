'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'customer_id', as: 'customer' })
      Order.hasMany(models.Detail, {
        foreignKey: 'order_id',
      })
    }
  }
  Order.init(
    {
      total_price: DataTypes.FLOAT,
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(['process', 'success', 'failed']),
        defaultValue: 'process',
      },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  )
  return Order
}
