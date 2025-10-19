const express = require('express');
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

module.exports = router;