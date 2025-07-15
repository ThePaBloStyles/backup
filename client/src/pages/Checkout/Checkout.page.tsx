import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonText, IonGrid, IonRow, IonCol, IonButtons,
  IonCard, IonCardContent, IonInput, IonSelect, IonSelectOption, IonCheckbox,
  IonLoading, IonAlert, IonRadioGroup, IonRadio
} from '@ionic/react';
import { arrowBack, card, cash, location, person, mail, call, logIn } from 'ionicons/icons';
import { useCart } from '../../contexts/Cart.context';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user, loading: authLoading, authMessage, requireAuth, checkAuth } = useAuth();
  const history = useHistory();
  
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('webpay');
  const [retryingAuth, setRetryingAuth] = useState(false);

  const handleRetryAuth = async () => {
    setRetryingAuth(true);
    try {
      await checkAuth();
    } catch (error) {
      console.error('Error al reintentar autenticación:', error);
    } finally {
      setRetryingAuth(false);
    }
  };

  // Verificar autenticación al cargar la página
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setAlertMessage('Debes iniciar sesión para realizar una compra');
      setShowAlert(true);
      // Redirigir al login después de mostrar el mensaje
      setTimeout(() => {
        history.push('/login');
      }, 2000);
    }
  }, [authLoading, isAuthenticated, history]);
  
  // Datos del cliente (pre-llenados con datos del usuario autenticado)
  const [customerData, setCustomerData] = useState({
    firstName: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    rut: ''
  });

  // Actualizar datos del cliente cuando el usuario se carga
  useEffect(() => {
    if (user) {
      setCustomerData(prev => ({
        ...prev,
        firstName: user.name || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Datos de envío
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    region: '',
    postalCode: '',
    deliveryType: 'delivery' // 'delivery' o 'pickup'
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (field: string, value: string, section: 'customer' | 'shipping') => {
    if (section === 'customer') {
      setCustomerData(prev => ({ ...prev, [field]: value }));
    } else {
      setShippingData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const requiredCustomerFields = ['firstName', 'lastName', 'email', 'phone'];
    const requiredShippingFields = shippingData.deliveryType === 'delivery' 
      ? ['address', 'city', 'region'] 
      : [];

    for (const field of requiredCustomerFields) {
      if (!customerData[field as keyof typeof customerData]) {
        setAlertMessage(`Por favor, completa el campo: ${field}`);
        setShowAlert(true);
        return false;
      }
    }

    for (const field of requiredShippingFields) {
      if (!shippingData[field as keyof typeof shippingData]) {
        setAlertMessage(`Por favor, completa el campo: ${field}`);
        setShowAlert(true);
        return false;
      }
    }

    if (!acceptTerms) {
      setAlertMessage('Debes aceptar los términos y condiciones');
      setShowAlert(true);
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    // Verificar autenticación antes de procesar
    if (!isAuthenticated) {
      setAlertMessage('Debes iniciar sesión para realizar una compra');
      setShowAlert(true);
      setTimeout(() => {
        history.push('/login');
      }, 2000);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        customer: {
          ...customerData,
          phone: customerData.phone, // Solo enviamos campos adicionales, email etc viene del usuario autenticado
          document: customerData.rut
        },
        shipping: shippingData,
        items: cartItems,
        total: cartTotal,
        paymentMethod: paymentMethod
      };

      if (paymentMethod === 'webpay') {
        // Iniciar transacción con Webpay
        const response = await api.post('/api/payment/webpay/create', orderData);
        
        if (response.data.success) {
          // Redirigir a Webpay
          window.location.href = response.data.redirectUrl;
        } else {
          throw new Error(response.data.message || 'Error al procesar el pago');
        }
      } else if (paymentMethod === 'cash') {
        // Procesar pago en efectivo (guardar orden)
        const response = await api.post('/api/payment/orders/cash', orderData);
        
        if (response.data.success) {
          clearCart();
          setAlertMessage('¡Orden creada exitosamente! Te contactaremos para coordinar el pago en efectivo.');
          setShowAlert(true);
          setTimeout(() => {
            history.push('/home');
          }, 3000);
        }
      }
    } catch (error: any) {
      console.error('Error al procesar pago:', error);
      
      // Manejar errores específicos de autenticación
      if (error.response?.data?.requireLogin || error.response?.status === 401) {
        setAlertMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        setShowAlert(true);
        setTimeout(() => {
          history.push('/login');
        }, 2000);
        return;
      }
      
      setAlertMessage(error.response?.data?.message || 'Error al procesar el pago. Intenta nuevamente.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    history.push('/cart');
    return null;
  }

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Verificando acceso...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '60vh' }}>
              <IonCol size="12" sizeMd="8" sizeLg="6">
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    <IonLoading isOpen={true} message={authMessage || "Verificando tu sesión..."} />
                    <p style={{ marginTop: '20px' }}>Por favor espera...</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }

  // Mostrar mensaje si no está autenticado
  if (!isAuthenticated) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonButton routerLink="/cart" fill="clear" color="light">
                <IonIcon icon={arrowBack} />
              </IonButton>
            </IonButtons>
            <IonTitle>Acceso Requerido</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '60vh' }}>
              <IonCol size="12" sizeMd="8" sizeLg="6">
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    <IonLoading isOpen={retryingAuth} message="Reintentando verificación..." />
                    <IonIcon icon={logIn} size="large" color="primary" />
                    <h2>Inicia Sesión para Continuar</h2>
                    <p>{authMessage || "Para realizar una compra necesitas tener una cuenta e iniciar sesión."}</p>
                    <IonButton 
                      expand="block" 
                      onClick={handleRetryAuth}
                      disabled={retryingAuth}
                      color="warning"
                      style={{ marginBottom: '12px' }}
                    >
                      Reintentar Verificación
                    </IonButton>
                    <IonButton expand="block" routerLink="/login" color="primary">
                      <IonIcon icon={logIn} slot="start" />
                      Iniciar Sesión
                    </IonButton>
                    <IonButton expand="block" fill="outline" routerLink="/register" color="secondary">
                      <IonIcon icon={person} slot="start" />
                      Crear Cuenta
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton routerLink="/cart" fill="clear" color="light">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Finalizar Compra</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            {/* Formulario de datos */}
            <IonCol size="12" sizeLg="8">
              
              {/* Datos del cliente */}
              <IonCard>
                <IonCardContent>
                  <IonText>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IonIcon icon={person} />
                      Datos del Cliente
                    </h3>
                  </IonText>
                  
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonInput
                          label="Nombre *"
                          value={customerData.firstName}
                          onIonChange={(e) => handleInputChange('firstName', e.detail.value!, 'customer')}
                          fill="outline"
                        />
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonInput
                          label="Apellido *"
                          value={customerData.lastName}
                          onIonChange={(e) => handleInputChange('lastName', e.detail.value!, 'customer')}
                          fill="outline"
                        />
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonInput
                          label="Email *"
                          type="email"
                          value={customerData.email}
                          onIonChange={(e) => handleInputChange('email', e.detail.value!, 'customer')}
                          fill="outline"
                        />
                      </IonCol>
                      <IonCol size="12" sizeMd="6">
                        <IonInput
                          label="Teléfono *"
                          type="tel"
                          value={customerData.phone}
                          onIonChange={(e) => handleInputChange('phone', e.detail.value!, 'customer')}
                          fill="outline"
                        />
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonInput
                          label="RUT (opcional)"
                          value={customerData.rut}
                          onIonChange={(e) => handleInputChange('rut', e.detail.value!, 'customer')}
                          fill="outline"
                        />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>

              {/* Tipo de entrega */}
              <IonCard>
                <IonCardContent>
                  <IonText>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IonIcon icon={location} />
                      Tipo de Entrega
                    </h3>
                  </IonText>
                  
                  <IonRadioGroup 
                    value={shippingData.deliveryType} 
                    onIonChange={(e) => handleInputChange('deliveryType', e.detail.value, 'shipping')}
                  >
                    <IonItem>
                      <IonRadio slot="start" value="delivery" />
                      <IonLabel>
                        <h3>Envío a domicilio</h3>
                        <p>Entregaremos el producto en tu dirección</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonRadio slot="start" value="pickup" />
                      <IonLabel>
                        <h3>Retiro en tienda</h3>
                        <p>Retira tu producto en nuestra tienda</p>
                      </IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </IonCardContent>
              </IonCard>

              {/* Dirección de envío (solo si es delivery) */}
              {shippingData.deliveryType === 'delivery' && (
                <IonCard>
                  <IonCardContent>
                    <IonText>
                      <h3>Dirección de Envío</h3>
                    </IonText>
                    
                    <IonGrid>
                      <IonRow>
                        <IonCol size="12">
                          <IonInput
                            label="Dirección *"
                            value={shippingData.address}
                            onIonChange={(e) => handleInputChange('address', e.detail.value!, 'shipping')}
                            fill="outline"
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <IonInput
                            label="Ciudad *"
                            value={shippingData.city}
                            onIonChange={(e) => handleInputChange('city', e.detail.value!, 'shipping')}
                            fill="outline"
                          />
                        </IonCol>
                        <IonCol size="12" sizeMd="6">
                          <IonSelect 
                            label="Región *"
                            value={shippingData.region}
                            onIonChange={(e) => handleInputChange('region', e.detail.value!, 'shipping')}
                            fill="outline"
                          >
                            <IonSelectOption value="metropolitana">Región Metropolitana</IonSelectOption>
                            <IonSelectOption value="valparaiso">Valparaíso</IonSelectOption>
                            <IonSelectOption value="biobio">Biobío</IonSelectOption>
                            <IonSelectOption value="araucania">Araucanía</IonSelectOption>
                            <IonSelectOption value="ohiggins">O'Higgins</IonSelectOption>
                            <IonSelectOption value="maule">Maule</IonSelectOption>
                            <IonSelectOption value="antofagasta">Antofagasta</IonSelectOption>
                            <IonSelectOption value="atacama">Atacama</IonSelectOption>
                            <IonSelectOption value="coquimbo">Coquimbo</IonSelectOption>
                            <IonSelectOption value="losrios">Los Ríos</IonSelectOption>
                            <IonSelectOption value="loslagos">Los Lagos</IonSelectOption>
                            <IonSelectOption value="aysen">Aysén</IonSelectOption>
                            <IonSelectOption value="magallanes">Magallanes</IonSelectOption>
                            <IonSelectOption value="tarapaca">Tarapacá</IonSelectOption>
                            <IonSelectOption value="arica">Arica y Parinacota</IonSelectOption>
                          </IonSelect>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12" sizeMd="6">
                          <IonInput
                            label="Código Postal"
                            value={shippingData.postalCode}
                            onIonChange={(e) => handleInputChange('postalCode', e.detail.value!, 'shipping')}
                            fill="outline"
                          />
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              )}

              {/* Método de pago */}
              <IonCard>
                <IonCardContent>
                  <IonText>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IonIcon icon={card} />
                      Método de Pago
                    </h3>
                  </IonText>
                  
                  <IonRadioGroup value={paymentMethod} onIonChange={(e) => setPaymentMethod(e.detail.value)}>
                    <IonItem>
                      <IonRadio slot="start" value="webpay" />
                      <IonLabel>
                        <h3>Webpay Plus</h3>
                        <p>Paga con tarjeta de crédito o débito</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonRadio slot="start" value="cash" />
                      <IonLabel>
                        <h3>Pago en Efectivo</h3>
                        <p>Paga al recibir el producto</p>
                      </IonLabel>
                    </IonItem>
                  </IonRadioGroup>
                </IonCardContent>
              </IonCard>

              {/* Términos y condiciones */}
              <IonCard>
                <IonCardContent>
                  <IonItem lines="none">
                    <IonCheckbox 
                      slot="start" 
                      checked={acceptTerms}
                      onIonChange={(e) => setAcceptTerms(e.detail.checked)}
                    />
                    <IonLabel>
                      <p>Acepto los <a href="#" style={{ color: '#0066CC' }}>términos y condiciones</a> y la <a href="#" style={{ color: '#0066CC' }}>política de privacidad</a></p>
                    </IonLabel>
                  </IonItem>
                </IonCardContent>
              </IonCard>

            </IonCol>

            {/* Resumen del pedido */}
            <IonCol size="12" sizeLg="4">
              <div style={{ position: 'sticky', top: '20px' }}>
                <IonCard>
                  <IonCardContent>
                    <IonText>
                      <h3>Resumen del Pedido</h3>
                    </IonText>

                    {/* Lista de productos */}
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                      {cartItems.map((item) => (
                        <div key={item._id} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: '1px solid #eee'
                        }}>
                          <div style={{ flex: 1 }}>
                            <IonText>
                              <p style={{ margin: '0', fontSize: '14px' }}>{item.name}</p>
                              <small style={{ color: '#666' }}>Cantidad: {item.quantity}</small>
                            </IonText>
                          </div>
                          <IonText>
                            <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                          </IonText>
                        </div>
                      ))}
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <IonText color="medium">Subtotal</IonText>
                      <IonText>${cartTotal.toLocaleString()}</IonText>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <IonText color="medium">Envío</IonText>
                      <IonText color="success">
                        {shippingData.deliveryType === 'delivery' ? 'Gratis' : 'Sin costo'}
                      </IonText>
                    </div>

                    <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #eee' }} />

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '20px'
                    }}>
                      <IonText>
                        <strong>Total</strong>
                      </IonText>
                      <IonText>
                        <strong style={{ fontSize: '20px' }}>
                          ${cartTotal.toLocaleString()}
                        </strong>
                      </IonText>
                    </div>

                    <IonButton 
                      expand="block" 
                      color="primary"
                      style={{ 
                        '--background': '#0066CC',
                        height: '48px',
                        fontWeight: 'bold',
                        marginBottom: '12px'
                      }}
                      onClick={processPayment}
                      disabled={!acceptTerms}
                    >
                      {paymentMethod === 'webpay' ? 'Pagar con Webpay' : 'Confirmar Pedido'}
                    </IonButton>

                    <IonButton 
                      expand="block" 
                      fill="outline"
                      routerLink="/cart"
                    >
                      Volver al Carrito
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading isOpen={loading} message="Procesando pago..." />
        
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default CheckoutPage;
