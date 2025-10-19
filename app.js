console.log("Iniciando app.js...");

const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contacts');

const app = express();
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/contacts', contactRoutes);

const PORT = 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});