const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User.model').default;

async function createSuperUser() {
  await mongoose.connect('mongodb://localhost:27017/proyecto_integracion');

  const password = await bcrypt.hash('superpassword', 10);

  const superUser = new User({
    name: 'Super',
    lastName: 'Usuario',
    email: 'super@admin.com',
    password,
    role: 'administrador',
    state: true,
    deleted: false,
    phone: '123456789',
    image: '',
    permissions: {},
    clients: []
  });

  await superUser.save();
  console.log('Superusuario creado');
  mongoose.disconnect();
}

createSuperUser();
