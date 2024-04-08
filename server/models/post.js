'use strict';
const {
  Model
} = require('sequelize');

const get_post_model = (DataTypes) => {
  return {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }

}

module.exports.get_post_model = get_post_model;
module.exports.model = (sequelize, DataTypes) => {
  const post_model = get_post_model(DataTypes);
  class Post extends Model {
    /**
     * Helper method for defining  associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' })
    }
    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined }
    }
  }
  Post.init(
    post_model, {
    sequelize,
    modelName: 'Post',
    tableName: 'Post',
  });
  return Post;
};