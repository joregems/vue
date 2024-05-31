'use strict';
const { Model } = require('sequelize');

const get_shopping_cart_detail_model = (DataTypes) => {
  return {
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ShoppingCartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'ShoppingCart',
        key: 'id'
      }
    },
    ProductId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Product',
        key: 'id'
      }
    }
  }
}

module.exports.get_shopping_cart_detail_model = get_shopping_cart_detail_model;
module.exports.model = (sequelize, DataTypes) => {
  const shopping_cart_cetail_model = get_shopping_cart_detail_model(DataTypes);
  // const Product = sequelize.define('Product', { name: DataTypes.STRING });
  // const ShoppingCart = sequelize.define('ShoppingCart', { name: DataTypes.STRING });  
  class ShoppingCartDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ShoppingCart, Product }) {
      // define association here

    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        ShoppingCartId: undefined,
        ProductId: undefined,
        createdAt: undefined, updatedAt: undefined
      }
    }    
  }
  ShoppingCartDetail.init(
    shopping_cart_cetail_model, {
    sequelize,
    modelName: 'ShoppingCartDetail',
    tableName: 'ShoppingCartDetail',
  });
  return ShoppingCartDetail;
};
