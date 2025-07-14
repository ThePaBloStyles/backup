# Vista de Perfil de Usuario

## Funcionalidades Implementadas

La nueva página de perfil de usuario (`/profile`) proporciona una interfaz completa para que los usuarios gestionen su información personal y visualicen su historial de compras.

### Características Principales

#### 1. Información Personal
- **Nombre y Apellido**: Visualización y edición de datos básicos
- **Email**: Mostrado como solo lectura (identificador único)
- **Teléfono**: Campo opcional para contacto
- **Dirección**: Campo opcional para entregas

#### 2. Gestión de Perfil
- **Edición de Información**: Modal con formulario para actualizar datos personales
- **Validación de Campos**: Validación en frontend y backend
- **Confirmación Visual**: Alertas de éxito/error en las operaciones

#### 3. Cambio de Contraseña
- **Verificación de Contraseña Actual**: Seguridad adicional
- **Nueva Contraseña**: Mínimo 6 caracteres
- **Confirmación**: Validación de coincidencia
- **Encriptación**: Uso de bcrypt para almacenamiento seguro

#### 4. Historial de Compras
- **Lista de Órdenes**: Visualización cronológica de compras
- **Detalles de Orden**: Total, fecha, estado
- **Estados Disponibles**: Pendiente, En proceso, Enviado, Entregado, Cancelado
- **Formato de Moneda**: Pesos chilenos (CLP)

### Navegación

#### Acceso al Perfil
Los usuarios pueden acceder al perfil desde el ícono de persona en el header principal:

- **Usuario No Logueado**: Redirección a login
- **Administrador/Bodeguero**: Redirección a panel administrativo
- **Usuario Regular**: Redirección a página de perfil

### Endpoints de Backend

#### Obtener Usuario
```
GET /api/users/getUser/:id
```
Retorna información completa del usuario

#### Actualizar Perfil
```
PUT /api/users/updateProfile/:id
```
Actualiza campos específicos del perfil (name, lastName, phone, address)

#### Cambiar Contraseña
```
PUT /api/users/changePassword/:id
```
Cambia la contraseña del usuario con validación de contraseña actual

#### Obtener Órdenes del Usuario
```
GET /api/users/getUserOrders/:id
```
Retorna el historial de compras del usuario

### Modelo de Datos

#### Usuario (Actualizado)
```typescript
interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'usuario' | 'administrador' | 'bodeguero';
}
```

#### Orden
```typescript
interface Order {
  _id: string;
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userId?: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}
```

### Seguridad

#### Validaciones Frontend
- Campos obligatorios marcados
- Longitud mínima de contraseña (6 caracteres)
- Confirmación de contraseña nueva
- Sanitización de inputs

#### Validaciones Backend
- Verificación de contraseña actual
- Encriptación de nueva contraseña con bcrypt
- Validación de existencia de usuario
- Manejo de errores y excepciones

### Experiencia de Usuario

#### Interfaz Responsive
- Diseño adaptable usando Ionic components
- Cards organizadas por sección
- Modales para edición de datos
- Iconos intuitivos (person, call, location, bag, key)

#### Feedback Visual
- Loading state durante carga inicial
- Alerts informativos para operaciones
- Estados de botones (disabled/enabled)
- Colores distintivos para estados de órdenes

### Archivos Modificados/Creados

#### Frontend
- `client/src/pages/Profile/Profile.page.tsx` - Página principal de perfil
- `client/src/pages/Profile/index.ts` - Exportación del componente
- `client/src/App.tsx` - Ruta `/profile` agregada
- `client/src/pages/Home/Home.page.tsx` - Navegación actualizada

#### Backend
- `server/src/controllers/Users.controller.ts` - Nuevos endpoints
- `server/src/routes/Users.route.ts` - Rutas de perfil y contraseña
- `server/src/models/User.model.ts` - Campo `address` agregado
- `server/src/interfaces/User.interface.ts` - Interface actualizada

### Próximas Mejoras

1. **Edición de Avatar**: Subida y gestión de imagen de perfil
2. **Historial Detallado**: Expandir información de órdenes con productos específicos
3. **Preferencias**: Configuración de notificaciones y privacidad
4. **Verificación de Email**: Proceso de verificación de correo electrónico
5. **Autenticación 2FA**: Factor de autenticación adicional

### Uso

1. **Login**: Iniciar sesión con credenciales
2. **Navegación**: Hacer clic en ícono de persona (si es usuario regular)
3. **Visualización**: Ver información personal y historial
4. **Edición**: Usar botón "Editar Información" para modificar datos
5. **Cambio de Contraseña**: Usar botón "Cambiar Contraseña" con validación
