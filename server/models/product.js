'use strict';
const { Model } = require('sequelize');
const get_product_model = (DataTypes) => {
  return {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }
}
module.exports.get_product_model=get_product_model;
module.exports.model = (sequelize, DataTypes) => {
  const product_model = get_product_model(DataTypes);
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model) {
      // define association here
    }
    toJSON() {
      return { ...this.get(),
        id: undefined, userId: undefined,
        createdAt: undefined, updatedAt: undefined }
    }
  }
  Product.init(
    product_model, {
    sequelize,
    modelName: 'Product',
    tableName: 'Product',
  });
  return Product;
};