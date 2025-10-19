const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};