import { Schema, model, Document } from 'mongoose';

interface IOrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rut?: string;
  userId?: string;
}

interface IShipping {
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
}

interface IOrder extends Document {
  orderId: string;
  customer: ICustomer;
  shipping: IShipping;
  items: IOrderItem[];
  total: number;
  paymentMethod: 'webpay' | 'cash';
  status: 'pending' | 'paid' | 'failed' | 'pending_cash' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  webpayToken?: string;
  webpayResponse?: any;
  createdAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  notes?: string;
}

const OrderSchema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rut: { type: String },
    userId: { type: String }
  },
  shipping: {
    deliveryType: { 
      type: String, 
      enum: ['delivery', 'pickup'], 
      required: true 
    },
    address: { type: String },
    city: { type: String },
    region: { type: String },
    postalCode: { type: String }
  },
  items: [{
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['webpay', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'pending_cash', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  webpayToken: {
    type: String
  },
  webpayResponse: {
    type: Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Índices para mejorar consultas
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ 'customer.userId': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = model<IOrder>('Order', OrderSchema);

export default Order;
export { IOrder, IOrderItem, ICustomer, IShipping };
