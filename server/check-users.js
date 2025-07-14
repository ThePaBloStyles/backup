const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/proyecto_integracion');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
  state: Boolean
}, { timestamps: true }));

User.find({}).then(users => {
  console.log('=== Usuarios en la base de datos ===');
  if (users.length === 0) {
    console.log('No hay usuarios en la base de datos');
  } else {
    users.forEach(user => {
      console.log(`- Email: ${user.email}`);
      console.log(`  Nombre: ${user.name} ${user.lastName}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  State: ${user.state}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log('---');
    });
  }
  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  mongoose.connection.close();
});
