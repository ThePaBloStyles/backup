import { Request, Response } from 'express';
import { RequestWithUser } from '../interfaces/User.interface';
import axios from 'axios';
import crypto from 'crypto';
import Order from '../models/Order.model';
import User from '../models/User.model';
import { sendEmail, createEmailTemplate } from '../utils/email';

class PaymentController {
  // Configuración de Webpay (debes configurar estas variables en tu .env)
  private static WEBPAY_API_KEY = process.env.WEBPAY_API_KEY || 'tu_api_key_aqui';
  private static WEBPAY_COMMERCE_CODE = process.env.WEBPAY_COMMERCE_CODE || 'tu_commerce_code_aqui';
  private static WEBPAY_BASE_URL = process.env.WEBPAY_BASE_URL || 'https://webpay3gint.transbank.cl';
  private static get RETURN_URL() {
    return (process.env.FRONTEND_URL || 'http://localhost:5176') + '/payment/return';
  }
  private static get FINAL_URL() {
    return (process.env.FRONTEND_URL || 'http://localhost:5176') + '/payment/result';
  }
  private static IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'developement';

  /**
   * Crear transacción con Webpay
   */
  public static async createWebpayTransaction(req: RequestWithUser, res: Response) {
    try {
      console.log('🔍 DEBUG: NODE_ENV =', process.env.NODE_ENV);
      console.log('🔍 DEBUG: IS_DEVELOPMENT =', PaymentController.IS_DEVELOPMENT);
      
      // Verificar que el usuario esté autenticado (ya verificado por middleware)
      const authenticatedUser = req.user;
      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
          error: 'USER_NOT_AUTHENTICATED',
          requireLogin: true
        });
      }

      console.log('👤 Usuario autenticado iniciando compra:', authenticatedUser.email);
      
      const { shipping, items, total, paymentMethod } = req.body;

      // Usar información del usuario autenticado para customer
      const customer = {
        userId: authenticatedUser._id,
        name: `${authenticatedUser.name} ${authenticatedUser.lastName}`.trim() || authenticatedUser.email,
        email: authenticatedUser.email,
        phone: req.body.customer?.phone || authenticatedUser.phone || '',
        document: req.body.customer?.document || '' // Este campo viene del formulario
      };

      // Validación de datos requeridos
      if (!shipping || !items || !Array.isArray(items) || items.length === 0 || !total) {
        return res.status(400).json({
          success: false,
          message: 'Datos de compra incompletos. Se requiere información de envío, productos y total.',
          error: 'INCOMPLETE_PURCHASE_DATA'
        });
      }

      // Generar ID único para la orden
      const orderId = crypto.randomBytes(16).toString('hex');
      const buyOrder = `ORDER_${Date.now()}_${orderId.slice(0, 8)}`;

      // Crear orden en la base de datos con estado pendiente
      const order = new Order({
        orderId: buyOrder,
        customer,
        shipping,
        items,
        total,
        paymentMethod: 'webpay',
        status: 'pending',
        createdAt: new Date()
      });

      await order.save();

      // En modo desarrollo, simular transacción exitosa
      if (PaymentController.IS_DEVELOPMENT) {
        console.log('🔧 MODO DESARROLLO: Simulando transacción Webpay');
        
        // Simular token de Webpay
        const mockToken = `TOKEN_${orderId}`;
        
        // Actualizar orden con token simulado
        await Order.findOneAndUpdate(
          { orderId: buyOrder },
          { webpayToken: mockToken }
        );

        // Simular URL de Webpay (redirigir directo al resultado)
        const mockUrl = `${PaymentController.FINAL_URL}?status=success&order=${buyOrder}`;

        res.json({
          success: true,
          redirectUrl: mockUrl,
          token: mockToken,
          orderId: buyOrder,
          isDevelopment: true
        });

        return;
      }

      // Preparar datos para Webpay (solo en producción)
      const webpayData = {
        buy_order: buyOrder,
        session_id: `SESSION_${orderId}`,
        amount: total,
        return_url: PaymentController.RETURN_URL
      };

      // Realizar llamada a Webpay
      const webpayResponse = await axios.post(
        `${PaymentController.WEBPAY_BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`,
        webpayData,
        {
          headers: {
            'Tbk-Api-Key-Id': PaymentController.WEBPAY_COMMERCE_CODE,
            'Tbk-Api-Key-Secret': PaymentController.WEBPAY_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (webpayResponse.data.token) {
        // Actualizar orden con token de Webpay
        await Order.findOneAndUpdate(
          { orderId: buyOrder },
          { webpayToken: webpayResponse.data.token }
        );

        res.json({
          success: true,
          redirectUrl: webpayResponse.data.url + '?token_ws=' + webpayResponse.data.token,
          token: webpayResponse.data.token,
          orderId: buyOrder
        });
      } else {
        throw new Error('Error al crear transacción en Webpay');
      }

    } catch (error: any) {
      console.error('Error en createWebpayTransaction:', error);
      res.status(500).json({
        success: false,
        message: 'Error al procesar el pago con Webpay',
        error: error.message
      });
    }
  }

  /**
   * Confirmar transacción de Webpay
   */
  public static async confirmWebpayTransaction(req: RequestWithUser, res: Response) {
    try {
      const { token_ws } = req.body;

      if (!token_ws) {
        return res.status(400).json({
          success: false,
          message: 'Token de Webpay requerido'
        });
      }

      // Buscar orden por token
      const order = await Order.findOne({ webpayToken: token_ws });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada'
        });
      }

      // En modo desarrollo, simular confirmación exitosa
      if (PaymentController.IS_DEVELOPMENT) {
        console.log('🔧 MODO DESARROLLO: Simulando confirmación Webpay exitosa');
        
        // Simular respuesta exitosa de Webpay
        const mockTransactionData = {
          status: 'AUTHORIZED',
          authorization_code: '123456',
          payment_type_code: 'VD',
          amount: order.total,
          buy_order: order.orderId,
          session_id: `SESSION_${Date.now()}`,
          card_detail: {
            card_number: '************1234'
          },
          transaction_date: new Date().toISOString()
        };

        order.status = 'paid';
        order.webpayResponse = mockTransactionData;
        order.paidAt = new Date();
        
        await order.save();

        // Enviar email de confirmación
        try {
          await PaymentController.sendOrderConfirmationEmail(order);
        } catch (emailError) {
          console.error('Error enviando email:', emailError);
        }

        return res.json({
          success: true,
          message: 'Pago simulado aprobado (modo desarrollo)',
          order: order,
          transaction: mockTransactionData,
          isDevelopment: true
        });
      }

      // Confirmar transacción con Webpay (solo en producción)
      const confirmResponse = await axios.put(
        `${PaymentController.WEBPAY_BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${token_ws}`,
        {},
        {
          headers: {
            'Tbk-Api-Key-Id': PaymentController.WEBPAY_COMMERCE_CODE,
            'Tbk-Api-Key-Secret': PaymentController.WEBPAY_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const transactionData = confirmResponse.data;

      // Actualizar estado de la orden según resultado de Webpay
      if (transactionData.status === 'AUTHORIZED') {
        order.status = 'paid';
        order.webpayResponse = transactionData;
        order.paidAt = new Date();
        
        await order.save();

        // Enviar email de confirmación
        try {
          await PaymentController.sendOrderConfirmationEmail(order);
        } catch (emailError) {
          console.error('Error enviando email:', emailError);
        }

        res.json({
          success: true,
          message: 'Pago aprobado',
          order: order,
          transaction: transactionData
        });
      } else {
        order.status = 'failed';
        order.webpayResponse = transactionData;
        await order.save();

        res.json({
          success: false,
          message: 'Pago rechazado',
          transaction: transactionData
        });
      }

    } catch (error: any) {
      console.error('Error en confirmWebpayTransaction:', error);
      res.status(500).json({
        success: false,
        message: 'Error al confirmar el pago',
        error: error.message
      });
    }
  }

  /**
   * Manejar retorno desde Webpay
   */
  public static async handleWebpayReturn(req: Request, res: Response) {
    try {
      const { token_ws } = req.query;

      if (!token_ws) {
        return res.redirect(`${PaymentController.FINAL_URL}?status=error`);
      }

      // Confirmar automáticamente la transacción
      const confirmResult = await PaymentController.confirmWebpayTransaction(
        { body: { token_ws } } as Request,
        { json: () => {}, status: () => ({ json: () => {} }) } as any
      );

      // Buscar orden para redirigir
      const order = await Order.findOne({ webpayToken: token_ws });

      if (order && order.status === 'paid') {
        res.redirect(`${PaymentController.FINAL_URL}?status=success&order=${order.orderId}`);
      } else {
        res.redirect(`${PaymentController.FINAL_URL}?status=failed`);
      }

    } catch (error) {
      console.error('Error en handleWebpayReturn:', error);
      res.redirect(`${PaymentController.FINAL_URL}?status=error`);
    }
  }

  /**
   * Crear orden con pago en efectivo
   */
  public static async createCashOrder(req: RequestWithUser, res: Response) {
    try {
      // Verificar que el usuario esté autenticado
      const authenticatedUser = req.user;
      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
          error: 'USER_NOT_AUTHENTICATED',
          requireLogin: true
        });
      }

      console.log('👤 Usuario autenticado creando orden en efectivo:', authenticatedUser.email);
      
      const { shipping, items, total } = req.body;

      // Usar información del usuario autenticado para customer
      const customer = {
        userId: authenticatedUser._id,
        name: `${authenticatedUser.name} ${authenticatedUser.lastName}`.trim() || authenticatedUser.email,
        email: authenticatedUser.email,
        phone: req.body.customer?.phone || authenticatedUser.phone || '',
        document: req.body.customer?.document || ''
      };

      // Validación de datos requeridos
      if (!shipping || !items || !Array.isArray(items) || items.length === 0 || !total) {
        return res.status(400).json({
          success: false,
          message: 'Datos de orden incompletos. Se requiere información de envío, productos y total.',
          error: 'INCOMPLETE_ORDER_DATA'
        });
      }

      const orderId = `CASH_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

      const order = new Order({
        orderId,
        customer,
        shipping,
        items,
        total,
        paymentMethod: 'cash',
        status: 'pending_cash',
        createdAt: new Date()
      });

      await order.save();

      // Enviar email de confirmación
      try {
        await PaymentController.sendCashOrderEmail(order);
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
      }

      res.json({
        success: true,
        message: 'Orden creada exitosamente',
        order: order
      });

    } catch (error: any) {
      console.error('Error en createCashOrder:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la orden',
        error: error.message
      });
    }
  }

  /**
   * Obtener orden por ID
   */
  public static async getOrderById(req: RequestWithUser, res: Response) {
    try {
      // Verificar que el usuario esté autenticado
      const authenticatedUser = req.user;
      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
          error: 'USER_NOT_AUTHENTICATED',
          requireLogin: true
        });
      }

      const { id } = req.params;
      
      // Buscar la orden por ID y verificar que pertenezca al usuario autenticado
      const order = await Order.findOne({ 
        orderId: id,
        'customer.userId': authenticatedUser._id 
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Orden no encontrada o no tienes permiso para verla'
        });
      }

      console.log('👤 Usuario consultando orden:', authenticatedUser.email, 'Orden:', id);

      res.json({
        success: true,
        order: order
      });

    } catch (error: any) {
      console.error('Error en getOrderById:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la orden',
        error: error.message
      });
    }
  }

  /**
   * Obtener órdenes por usuario
   */
  public static async getOrdersByUser(req: RequestWithUser, res: Response) {
    try {
      // Verificar que el usuario esté autenticado
      const authenticatedUser = req.user;
      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado',
          error: 'USER_NOT_AUTHENTICATED',
          requireLogin: true
        });
      }

      console.log('👤 Consultando órdenes para usuario:', authenticatedUser.email);
      
      // Usar el ID del usuario autenticado directamente
      const userId = authenticatedUser._id;

      const orders = await Order.find({ 'customer.userId': userId })
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        orders: orders,
        userEmail: authenticatedUser.email
      });

    } catch (error: any) {
      console.error('Error en getOrdersByUser:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las órdenes',
        error: error.message
      });
    }
  }

  /**
   * Enviar email de confirmación de orden pagada
   */
  private static async sendOrderConfirmationEmail(order: any) {
    const content = `
      <h2>¡Gracias por tu compra!</h2>
      <p>Hola ${order.customer.firstName},</p>
      <p>Tu orden <strong>${order.orderId}</strong> ha sido procesada exitosamente.</p>
      
      <h3>Detalles de la orden:</h3>
      <ul>
        ${order.items.map((item: any) => `
          <li>${item.name} - Cantidad: ${item.quantity} - $${(item.price * item.quantity).toLocaleString()}</li>
        `).join('')}
      </ul>
      
      <p><strong>Total: $${order.total.toLocaleString()}</strong></p>
      
      ${order.shipping.deliveryType === 'delivery' 
        ? `<p>Tu pedido será enviado a: ${order.shipping.address}, ${order.shipping.city}</p>`
        : `<p>Puedes retirar tu pedido en nuestra tienda.</p>`
      }
      
      <p>¡Gracias por confiar en nosotros!</p>
    `;

    const emailHtml = createEmailTemplate(content, `Confirmación de compra - ${order.orderId}`);

    return sendEmail(
      order.customer.email,
      `Confirmación de compra - Orden ${order.orderId}`,
      emailHtml
    );
  }

  /**
   * Enviar email de confirmación de orden en efectivo
   */
  private static async sendCashOrderEmail(order: any) {
    const content = `
      <h2>¡Orden recibida!</h2>
      <p>Hola ${order.customer.firstName},</p>
      <p>Hemos recibido tu orden <strong>${order.orderId}</strong> con pago en efectivo.</p>
      
      <h3>Detalles de la orden:</h3>
      <ul>
        ${order.items.map((item: any) => `
          <li>${item.name} - Cantidad: ${item.quantity} - $${(item.price * item.quantity).toLocaleString()}</li>
        `).join('')}
      </ul>
      
      <p><strong>Total a pagar: $${order.total.toLocaleString()}</strong></p>
      
      <p>Te contactaremos pronto para coordinar la entrega y el pago.</p>
      
      <p>¡Gracias por confiar en nosotros!</p>
    `;

    const emailHtml = createEmailTemplate(content, `Orden recibida - ${order.orderId}`);

    return sendEmail(
      order.customer.email,
      `Orden recibida - ${order.orderId}`,
      emailHtml
    );
  }
}

export default PaymentController;
