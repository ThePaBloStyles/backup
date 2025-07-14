const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createBodegueroUser() {
  const client = new MongoClient('mongodb://localhost:27017/proyecto_integracion');
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db('proyecto_integracion');
    const users = db.collection('users');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('bodeguero123', salt);
    
    // Crear usuario bodeguero
    const bodegueroUser = {
      name: 'Bodeguero',
      lastName: 'Principal',
      email: 'bodeguero@empresa.com',
      password: hashedPassword,
      role: 'bodeguero',
      state: true,
      deleted: false,
      clients: [],
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Verificar si ya existe
    const existing = await users.findOne({ email: 'bodeguero@empresa.com' });
    if (existing) {
      console.log('Usuario bodeguero ya existe, actualizando...');
      await users.updateOne(
        { email: 'bodeguero@empresa.com' },
        { $set: { password: hashedPassword, role: 'bodeguero', updatedAt: new Date() } }
      );
    } else {
      console.log('Creando nuevo usuario bodeguero...');
      await users.insertOne(bodegueroUser);
    }
    
    console.log('✅ Usuario bodeguero creado/actualizado exitosamente');
    console.log('📧 Email: bodeguero@empresa.com');
    console.log('🔐 Password: bodeguero123');
    console.log('👤 Rol: bodeguero');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createBodegueroUser();
