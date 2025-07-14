import { Router } from 'express';
import PaymentController from '../controllers/Payment.controller';
import { authMiddleware, clientAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rutas para pagos con Webpay - REQUIEREN AUTENTICACIÓN
router.post('/webpay/create', clientAuthMiddleware, PaymentController.createWebpayTransaction);
router.post('/webpay/confirm', clientAuthMiddleware, PaymentController.confirmWebpayTransaction);
router.get('/webpay/return', PaymentController.handleWebpayReturn); // Esta puede no requerir auth ya que es callback de Webpay

// Rutas para órdenes con pago en efectivo - REQUIEREN AUTENTICACIÓN  
router.post('/orders/cash', clientAuthMiddleware, PaymentController.createCashOrder);

// Rutas para consultar estado de órdenes - REQUIEREN AUTENTICACIÓN
router.get('/orders/:id', clientAuthMiddleware, PaymentController.getOrderById);
router.get('/orders', clientAuthMiddleware, PaymentController.getOrdersByUser);

export default router;
