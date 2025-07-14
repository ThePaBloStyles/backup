# Sistema de Pagos con Webpay

Este sistema implementa una integración completa con Webpay Plus de Transbank para procesar pagos en línea, además de soporte para pagos en efectivo.

## Características

- ✅ Integración completa con Webpay Plus
- ✅ Soporte para pagos en efectivo
- ✅ Carrito de compras funcional
- ✅ Gestión de órdenes
- ✅ Envío de emails de confirmación
- ✅ Página de checkout profesional
- ✅ Resultado de pagos en tiempo real

## Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# Webpay (Transbank)
WEBPAY_API_KEY=tu_api_key_de_webpay
WEBPAY_COMMERCE_CODE=tu_commerce_code
WEBPAY_BASE_URL=https://webpay3gint.transbank.cl

# Email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password
EMAIL_FROM="Tu Tienda" <noreply@tutienda.com>

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 2. Configuración de Webpay

Para usar Webpay en producción:

1. Registrarse en [Transbank](https://www.transbank.cl/)
2. Obtener las credenciales de integración
3. Cambiar `WEBPAY_BASE_URL` a la URL de producción cuando esté listo

Para desarrollo/pruebas, puedes usar las credenciales de integración de Transbank.

### 3. Configuración de Email

Para Gmail:
1. Habilitar autenticación de 2 factores
2. Generar una contraseña de aplicación
3. Usar esa contraseña en `EMAIL_PASSWORD`

Para otros proveedores, modificar el método `createTransporter` en `src/utils/email.ts`.

## Flujo de Pagos

### Webpay Plus

1. **Cliente completa checkout** → Formulario con datos personales y de envío
2. **Crear transacción** → `POST /api/payment/webpay/create`
3. **Redirección a Webpay** → Cliente ingresa datos de tarjeta
4. **Retorno desde Webpay** → `GET /api/payment/webpay/return`
5. **Confirmación** → `POST /api/payment/webpay/confirm`
6. **Resultado final** → Cliente ve resultado en `/payment/result`

### Pago en Efectivo

1. **Cliente selecciona efectivo** → En el checkout
2. **Crear orden** → `POST /api/payment/orders/cash`
3. **Confirmación** → Email automático al cliente
4. **Seguimiento** → Orden queda pendiente para gestión manual

## Endpoints de la API

### Pagos
- `POST /api/payment/webpay/create` - Crear transacción Webpay
- `POST /api/payment/webpay/confirm` - Confirmar transacción
- `GET /api/payment/webpay/return` - Manejar retorno desde Webpay
- `POST /api/payment/orders/cash` - Crear orden con pago en efectivo

### Órdenes
- `GET /api/payment/orders/:id` - Obtener orden por ID
- `GET /api/payment/orders` - Obtener órdenes del usuario (requiere auth)

## Modelos de Datos

### Orden (Order)
```typescript
{
  orderId: string,           // ID único de la orden
  customer: {                // Datos del cliente
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    rut?: string
  },
  shipping: {                // Datos de envío
    deliveryType: 'delivery' | 'pickup',
    address?: string,
    city?: string,
    region?: string
  },
  items: [                   // Productos de la orden
    {
      _id: string,
      name: string,
      price: number,
      quantity: number
    }
  ],
  total: number,             // Total de la orden
  paymentMethod: 'webpay' | 'cash',
  status: 'pending' | 'paid' | 'failed' | 'pending_cash',
  webpayToken?: string,      // Token de Webpay
  webpayResponse?: object,   // Respuesta completa de Webpay
  createdAt: Date,
  paidAt?: Date
}
```

## Estados de Órdenes

- `pending` - Orden creada, esperando pago Webpay
- `paid` - Orden pagada exitosamente
- `failed` - Pago falló o fue rechazado
- `pending_cash` - Orden con pago en efectivo pendiente
- `confirmed` - Orden confirmada (para gestión manual)
- `shipped` - Orden enviada
- `delivered` - Orden entregada
- `cancelled` - Orden cancelada

## Seguridad

- ✅ Validación de formularios en frontend y backend
- ✅ Sanitización de datos de entrada
- ✅ Encriptación de comunicaciones con Webpay
- ✅ Verificación de tokens de Webpay
- ✅ Autenticación para consultas de órdenes

## Testing

Para probar el sistema:

1. **Desarrollo**: Usar credenciales de integración de Transbank
2. **Tarjetas de prueba**: Usar las tarjetas proporcionadas por Transbank
3. **Emails**: Usar un servicio como MailHog para desarrollo

## Instalación

1. Instalar dependencias del servidor:
```bash
cd server
npm install
```

2. Instalar dependencias del cliente:
```bash
cd client
npm install
```

3. Configurar variables de entorno

4. Ejecutar en modo desarrollo:
```bash
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Cliente  
cd client
npm start
```

## Notas Importantes

- El sistema requiere HTTPS en producción para Webpay
- Los emails requieren configuración del proveedor SMTP
- Las credenciales de Webpay deben mantenerse seguras
- Implementar logging adecuado para auditoría de transacciones

## Próximas Mejoras

- [ ] Dashboard de administración para órdenes
- [ ] Integración con sistema de inventario
- [ ] Notificaciones push para estado de órdenes
- [ ] Sistema de devoluciones
- [ ] Múltiples métodos de envío con costos
- [ ] Descuentos y cupones
