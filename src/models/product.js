'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, { foreignKey: 'seller_id', as: 'seller' })

      Product.belongsToMany(models.User, {
        through: models.Cart,
        foreignKey: 'product_id',
        as: 'product',
      })

      Product.hasMany(models.Detail, {
        foreignKey: 'product_id',
      })
    }
  }
  Product.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      price: DataTypes.FLOAT,
      stock: DataTypes.INTEGER,
      seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Product',
    }
  )
  return Product
}
