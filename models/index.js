const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const User = require('./user')(sequelize);
const Contact = require('./contact')(sequelize);

User.hasMany(Contact, { onDelete: 'CASCADE' });
Contact.belongsTo(User);

module.exports = { sequelize, User, Contact };