'use strict';
const {
  Model
} = require('sequelize');

const get_shopping_cart_model = (DataTypes) => {
  return {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  };
}

module.exports.get_shopping_cart_model = get_shopping_cart_model;
module.exports.model = (sequelize, DataTypes) => {
  const shoping_cart_model = get_shopping_cart_model(DataTypes);
  class ShoppingCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Product, User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
      this.belongsToMany(Product, { through: 'ShoppingCartDetail', as: 'products' })
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        createdAt: undefined, updatedAt: undefined
      }
    }
  }

  ShoppingCart.init(
    shoping_cart_model, {
    sequelize,
    modelName: 'ShoppingCart',
    tableName: 'ShoppingCart',

  });
  return ShoppingCart;
};
