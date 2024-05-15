'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../utils/encript');
const get_user_model = (DataTypes) => {
  return {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty:{ msg: 'Must be a name' },
        isEmail: { msg: 'Must be a valid email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordStrength(password) {
          // Initialize variables
          // Check password length
          if (password.length < 8) {
            throw new Error('password must be at least 8 characters long');
          }

          // Check for mixed case
          else if (!(password.match(/[a-z]/) && password.match(/[A-Z]/))) {
            throw new Error('password must contain lowercase and uppercase letters');
          }

          // Check for numbers
          else if (!password.match(/\d/)) {
            throw new Error('password must include at least one number');
          }

          // Check for special characters
          if (!password.match(/[^a-zA-Z\d]/)) {
            throw new Error('password must include at least one special character.');
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name must not be empty' }
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'guest'),
      allowNull: false,
      validate: {
        checkRole(role) {
          const allowed_roles = ['admin', 'user', 'guest']
          if (!allowed_roles.includes(role)) {
            throw new Error('Must be an allowed role: ' + allowed_roles.toString().replace(",", ", "));
          }

        }
      }
    }
  };
}
module.exports.get_user_fields = get_user_model;
module.exports.model = (sequelize, DataTypes) => {
  const user_model = get_user_model(DataTypes)
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, ShoppingCart }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
      this.hasOne(ShoppingCart, { foreignKey: 'userId', as: 'shoppingCart', onDelete: 'cascade' });

    }
    toJSON() {
      return { ...this.get(), id: undefined, password: '', createdAt: undefined, updatedAt: undefined };
    }
  }
  User.init(
    user_model,
    {
      hooks: {
        //this encrypt the password before store
        afterValidate: async (user, options) => {
          const hash = await hashPassword(user.password);
          user.password = hash
        },
        beforeUpdate: async (_record, options) => {
          options.validate = false;
        }
      },
      sequelize,
      tableName: 'User',
      modelName: 'User',
    }

  );
  // const beforeUpdate = function (_record, _options) {
  //     _options.validate = false;
  // };
  // User.addHook('beforeUpdate', beforeUpdate);

  return User;
};