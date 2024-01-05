'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Detail.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order_detail',
      })
      Detail.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      })
    }
  }
  Detail.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Detail',
    }
  )
  return Detail
}
