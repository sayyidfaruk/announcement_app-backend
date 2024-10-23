'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Announcement.belongsTo(models.User, {
        foreignKey: 'nrp',
      });
    }
  }
  Announcement.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING,
    nrp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Announcement',
  });
  return Announcement;
};