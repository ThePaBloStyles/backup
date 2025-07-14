const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function resetBodegueroPassword() {
  const client = new MongoClient('mongodb://localhost:27017/proyecto_integracion');
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db('proyecto_integracion');
    const users = db.collection('users');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('bodeguero123', salt);
    
    // Actualizar contraseña del bodeguero
    const result = await users.updateOne(
      { email: 'bodeguero@gmail.com' },
      { 
        $set: { 
          password: hashedPassword, 
          role: 'bodeguero',
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Contraseña del bodeguero actualizada exitosamente');
      console.log('📧 Email: bodeguero@gmail.com');
      console.log('🔐 Nueva Password: bodeguero123');
      console.log('👤 Rol: bodeguero');
    } else {
      console.log('❌ Usuario no encontrado');
    }
    
    // También verificar el usuario
    const user = await users.findOne({ email: 'bodeguero@gmail.com' });
    console.log('📋 Usuario encontrado:', {
      email: user.email,
      name: user.name,
      role: user.role,
      state: user.state
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

resetBodegueroPassword();
