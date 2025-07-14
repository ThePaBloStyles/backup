import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonIcon, IonText, IonCard, IonCardContent, IonList, IonItem, IonLabel,
  IonSpinner, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { checkmarkCircle, closeCircle, home, receipt } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/Cart.context';
import api from '../../utils/api';

const PaymentResultPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'error'>('error');
  const [orderData, setOrderData] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    const orderId = urlParams.get('order');
    const tokenWs = urlParams.get('token_ws');

    if (status === 'success' && orderId) {
      handleSuccessfulPayment(orderId);
    } else if (status === 'failed') {
      handleFailedPayment();
    } else if (tokenWs) {
      // Procesar retorno desde Webpay
      handleWebpayReturn(tokenWs);
    } else {
      handleError();
    }
  }, [location]);

  const handleSuccessfulPayment = async (orderId: string) => {
    try {
      const response = await api.get(`/api/payment/orders/${orderId}`);
      
      if (response.data.success) {
        setPaymentStatus('success');
        setOrderData(response.data.order);
        setMessage('¡Tu pago se ha procesado exitosamente!');
        clearCart();
      } else {
        throw new Error('Orden no encontrada');
      }
    } catch (error) {
      console.error('Error obteniendo orden:', error);
      setPaymentStatus('error');
      setMessage('Error al obtener los detalles de la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleFailedPayment = () => {
    setPaymentStatus('failed');
    setMessage('El pago no pudo ser procesado. Intenta nuevamente.');
    setLoading(false);
  };

  const handleWebpayReturn = async (tokenWs: string) => {
    try {
      const response = await api.post('/api/payment/webpay/confirm', {
        token_ws: tokenWs
      });

      if (response.data.success) {
        setPaymentStatus('success');
        setOrderData(response.data.order);
        setMessage('¡Tu pago con Webpay se ha procesado exitosamente!');
        clearCart();
      } else {
        setPaymentStatus('failed');
        setMessage(response.data.message || 'El pago fue rechazado');
      }
    } catch (error: any) {
      console.error('Error confirmando pago Webpay:', error);
      setPaymentStatus('error');
      setMessage('Error al procesar el pago con Webpay');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setPaymentStatus('error');
    setMessage('Ha ocurrido un error inesperado');
    setLoading(false);
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return checkmarkCircle;
      case 'failed':
      case 'error':
      default:
        return closeCircle;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'success';
      case 'failed':
      case 'error':
      default:
        return 'danger';
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Procesando Pago</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '20px'
          }}>
            <IonSpinner name="crescent" style={{ '--color': '#0066CC' }} />
            <IonText style={{ marginTop: '20px', textAlign: 'center' }}>
              <h3>Procesando tu pago...</h3>
              <p>Por favor espera mientras confirmamos tu transacción</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Resultado del Pago</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8" offsetMd="2" sizeLg="6" offsetLg="3">
              {/* Estado del pago */}
              <div style={{
                textAlign: 'center',
                padding: '40px 20px'
              }}>
                <IonIcon 
                  icon={getStatusIcon()} 
                  style={{ 
                    fontSize: '80px',
                    color: paymentStatus === 'success' ? '#28a745' : '#dc3545'
                  }}
                />
                
                <IonText color={getStatusColor()}>
                  <h1 style={{ margin: '20px 0 10px 0' }}>
                    {paymentStatus === 'success' ? '¡Pago Exitoso!' : 'Pago Fallido'}
                  </h1>
                </IonText>
                
                <IonText>
                  <p style={{ fontSize: '16px', color: '#666' }}>
                    {message}
                  </p>
                </IonText>
              </div>

              {/* Detalles de la orden (solo si el pago fue exitoso) */}
              {paymentStatus === 'success' && orderData && (
                <IonCard>
                  <IonCardContent>
                    <IonText>
                      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonIcon icon={receipt} />
                        Detalles de tu Orden
                      </h2>
                    </IonText>

                    <IonList>
                      <IonItem>
                        <IonLabel>
                          <h3>Número de Orden</h3>
                          <p>{orderData.orderId}</p>
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>
                          <h3>Total Pagado</h3>
                          <p>${orderData.total.toLocaleString()}</p>
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>
                          <h3>Método de Pago</h3>
                          <p>{orderData.paymentMethod === 'webpay' ? 'Webpay Plus' : 'Efectivo'}</p>
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <IonLabel>
                          <h3>Estado</h3>
                          <p style={{ color: '#28a745', fontWeight: 'bold' }}>
                            {orderData.status === 'paid' ? 'Pagado' : 'Pendiente'}
                          </p>
                        </IonLabel>
                      </IonItem>

                      {orderData.shipping.deliveryType === 'delivery' && (
                        <IonItem>
                          <IonLabel>
                            <h3>Dirección de Envío</h3>
                            <p>{orderData.shipping.address}, {orderData.shipping.city}</p>
                          </IonLabel>
                        </IonItem>
                      )}
                    </IonList>

                    {/* Lista de productos */}
                    <IonText style={{ marginTop: '20px' }}>
                      <h3>Productos Comprados</h3>
                    </IonText>
                    
                    <div style={{ marginTop: '10px' }}>
                      {orderData.items.map((item: any, index: number) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: index < orderData.items.length - 1 ? '1px solid #eee' : 'none'
                        }}>
                          <div>
                            <IonText>
                              <p style={{ margin: '0', fontWeight: '500' }}>{item.name}</p>
                              <small style={{ color: '#666' }}>Cantidad: {item.quantity}</small>
                            </IonText>
                          </div>
                          <IonText>
                            <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                          </IonText>
                        </div>
                      ))}
                    </div>

                    {paymentStatus === 'success' && (
                      <div style={{ 
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#d4edda',
                        borderRadius: '8px',
                        border: '1px solid #c3e6cb'
                      }}>
                        <IonText style={{ color: '#155724' }}>
                          <p style={{ margin: '0', fontSize: '14px' }}>
                            📧 Hemos enviado la confirmación de tu compra a <strong>{orderData.customer.email}</strong>
                          </p>
                        </IonText>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              )}

              {/* Botones de acción */}
              <div style={{ padding: '20px 0' }}>
                <IonButton 
                  expand="block" 
                  color="primary"
                  onClick={() => history.push('/home')}
                  style={{ marginBottom: '12px' }}
                >
                  <IonIcon icon={home} slot="start" />
                  Volver al Inicio
                </IonButton>

                {paymentStatus === 'failed' && (
                  <IonButton 
                    expand="block" 
                    fill="outline"
                    onClick={() => history.push('/cart')}
                  >
                    Intentar Nuevamente
                  </IonButton>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default PaymentResultPage;
