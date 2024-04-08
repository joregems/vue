'use strict';
const { Model } = require('sequelize');

const get_shopping_cart_detail_model = (DataTypes) => {
  return {
    idShoppingCart: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER
  }
}
module.exports.get_shopping_cart_detail_model = get_shopping_cart_detail_model;
module.exports.model = (sequelize, DataTypes) => {
  const shopping_cart_cetail_model = get_shopping_cart_detail_model(DataTypes);
  class ShoppingCartDetail extends Model {

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShoppingCartDetail.init(
    shopping_cart_cetail_model, {
    sequelize,
    modelName: 'ShoppingCartDetail',
  });
  return ShoppingCartDetail;
};