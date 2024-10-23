'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
      });

      User.hasMany(models.Announcement, {
        foreignKey: 'nrp',
      });
    }
  }
  User.init({
    nrp: {
      type:DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: DataTypes.STRING,
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refreshToken: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};