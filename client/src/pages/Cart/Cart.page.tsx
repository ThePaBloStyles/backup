import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonText, IonGrid, IonRow, IonCol, IonButtons,
  IonCard, IonCardContent, IonBadge, IonAlert
} from '@ionic/react';
import { arrowBack, trash, add, remove } from 'ionicons/icons';
import { useCart } from '../../contexts/Cart.context';
import { useState } from 'react';

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    cartCount, 
    cartTotal, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();
  
  const [showClearAlert, setShowClearAlert] = useState(false);

  if (cartItems.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonButton routerLink="/home" fill="clear" color="light">
                <IonIcon icon={arrowBack} />
              </IonButton>
            </IonButtons>
            <IonTitle>Mi Carrito</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ 
            textAlign: 'center', 
            marginTop: '100px',
            padding: '40px'
          }}>
            <IonIcon 
              icon={trash} 
              style={{ 
                fontSize: '80px', 
                color: '#ccc',
                marginBottom: '20px'
              }} 
            />
            <IonText>
              <h2>Tu carrito está vacío</h2>
              <p style={{ color: '#666' }}>
                Agrega productos para empezar a comprar
              </p>
            </IonText>
            <IonButton 
              routerLink="/home" 
              expand="block" 
              color="primary"
              style={{ marginTop: '20px' }}
            >
              Seguir Comprando
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton routerLink="/home" fill="clear" color="light">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            Mi Carrito 
            <IonBadge color="light" style={{ marginLeft: '8px' }}>
              {cartCount}
            </IonBadge>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton 
              fill="clear" 
              color="light"
              onClick={() => setShowClearAlert(true)}
            >
              <IonIcon icon={trash} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            {/* Lista de productos */}
            <IonCol size="12" sizeLg="8">
              <IonList>
                {cartItems.map((item) => (
                  <IonCard key={item._id} style={{ margin: '8px 0' }}>
                    <IonCardContent style={{ padding: '16px' }}>
                      <IonGrid>
                        <IonRow>
                          {/* Imagen del producto */}
                          <IonCol size="3">
                            <div style={{
                              width: '100%',
                              height: '80px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden'
                            }}>
                              <img 
                                src={item.img || 'https://via.placeholder.com/80x80?text=Sin+Imagen'} 
                                alt={item.name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                          </IonCol>

                          {/* Información del producto */}
                          <IonCol size="6">
                            <IonText>
                              <h3 style={{ 
                                margin: '0 0 4px 0',
                                fontSize: '16px',
                                fontWeight: '500'
                              }}>
                                {item.name}
                              </h3>
                            </IonText>
                            
                            {item.brand && (
                              <IonText color="medium">
                                <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>
                                  {item.brand}
                                </p>
                              </IonText>
                            )}

                            <IonText>
                              <p style={{ 
                                margin: '0',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#2d3436'
                              }}>
                                ${item.price.toLocaleString()}
                              </p>
                            </IonText>

                            <IonText color="success">
                              <small>Stock disponible: {item.stock}</small>
                            </IonText>
                          </IonCol>

                          {/* Controles de cantidad */}
                          <IonCol size="3">
                            <div style={{ 
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              height: '100%',
                              justifyContent: 'space-between'
                            }}>
                              {/* Botón eliminar */}
                              <IonButton 
                                fill="clear" 
                                color="danger"
                                size="small"
                                onClick={() => removeFromCart(item._id)}
                              >
                                <IonIcon icon={trash} />
                              </IonButton>

                              {/* Selector de cantidad */}
                              <div style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: 'white'
                              }}>
                                <IonButton 
                                  fill="clear" 
                                  size="small"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  style={{ '--color': '#666' }}
                                >
                                  <IonIcon icon={remove} />
                                </IonButton>
                                
                                <span style={{ 
                                  padding: '0 12px',
                                  minWidth: '40px',
                                  textAlign: 'center',
                                  fontWeight: 'bold'
                                }}>
                                  {item.quantity}
                                </span>
                                
                                <IonButton 
                                  fill="clear" 
                                  size="small"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  style={{ '--color': '#666' }}
                                >
                                  <IonIcon icon={add} />
                                </IonButton>
                              </div>

                              {/* Subtotal */}
                              <IonText>
                                <p style={{ 
                                  margin: '8px 0 0 0',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}>
                                  ${(item.price * item.quantity).toLocaleString()}
                                </p>
                              </IonText>
                            </div>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonList>
            </IonCol>

            {/* Resumen del pedido */}
            <IonCol size="12" sizeLg="4">
              <div style={{ position: 'sticky', top: '20px' }}>
                <IonCard>
                  <IonCardContent style={{ padding: '20px' }}>
                    <IonText>
                      <h3 style={{ margin: '0 0 16px 0' }}>Resumen del Pedido</h3>
                    </IonText>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <IonText color="medium">Productos ({cartCount})</IonText>
                      <IonText>${cartTotal.toLocaleString()}</IonText>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <IonText color="medium">Envío</IonText>
                      <IonText color="success">Gratis</IonText>
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
                      routerLink="/checkout"
                    >
                      Proceder al Pago
                    </IonButton>

                    <IonButton 
                      expand="block" 
                      fill="outline"
                      routerLink="/home"
                    >
                      Seguir Comprando
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Alerta para limpiar carrito */}
        <IonAlert
          isOpen={showClearAlert}
          onDidDismiss={() => setShowClearAlert(false)}
          header="¿Vaciar carrito?"
          message="¿Estás seguro de que deseas eliminar todos los productos del carrito?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Vaciar',
              handler: () => {
                clearCart();
                setShowClearAlert(false);
              },
              cssClass: 'danger'
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default CartPage;
