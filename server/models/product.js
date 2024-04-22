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
      validate: {
        notEmpty:{ msg: 'Must be a name' }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{ msg: 'Description must not be empty' }
      }
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty:{ msg: 'Must not be empty' }
      }
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty:{ msg: 'Must not be empty' },
        isNumeric:{ msg: 'Price must be a number' }
      }      
    }
  }
}
module.exports.get_product_model = get_product_model;
module.exports.model = (sequelize, DataTypes) => {
  const product_model = get_product_model(DataTypes);
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ShoppingCart }) {
      this.belongsToMany(ShoppingCart, { through: 'ShoppingCartDetail', as: 'shoppingCarts' })

    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        createdAt: undefined, updatedAt: undefined
      }
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