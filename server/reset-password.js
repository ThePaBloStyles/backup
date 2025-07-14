const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/proyecto_integracion');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
  state: Boolean
}, { timestamps: true }));

async function resetPassword() {
  try {
    // Resetear contraseña para bodeguero@gmail.com
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await User.updateOne(
      { email: 'bodeguero@gmail.com' },
      { password: hashedPassword }
    );
    
    console.log('Password updated for bodeguero@gmail.com');
    console.log('Nueva contraseña:', newPassword);
    console.log('Result:', result);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

resetPassword();
