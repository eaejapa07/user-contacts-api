const fs = require('fs');
const path = require('path');

const estrutura = {
  'app.js': `console.log("Iniciando app.js...");

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
    console.log(\`Servidor rodando em http://localhost:\${PORT}\`);
  });
});`,

  'package.json': `{
  "name": "user-contacts-api",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "body-parser": "^1.20.2",
    "express": "^4.18.2",
    "sequelize": "^6.35.1",
    "sqlite3": "^5.1.6"
  }
}`,

  'models/index.js': `const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const User = require('./user')(sequelize);
const Contact = require('./contact')(sequelize);

User.hasMany(Contact, { onDelete: 'CASCADE' });
Contact.belongsTo(User);

module.exports = { sequelize, User, Contact };`,

  'models/user.js': `const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });
};`,

  'models/contact.js': `const { DataTypes } = require('sequelize');

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
};`,

  'routes/users.js': `const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;`,

  'routes/contacts.js': `const express = require('express');
const router = express.Router();
const { Contact, User } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { userId, name, phone } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const contact = await Contact.create({ name, phone, UserId: userId });
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const contacts = await Contact.findAll({ include: 'User' });
  res.json(contacts);
});

module.exports = router;`
};

// Cria os diretórios
const dirs = ['models', 'routes'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Cria os arquivos
for (const [filePath, content] of Object.entries(estrutura)) {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content);
}

console.log('✅ Projeto gerado com sucesso!');
