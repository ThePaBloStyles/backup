import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonButton, IonIcon, IonText, IonChip, IonBadge,
  IonGrid, IonRow, IonCol, IonItem, IonLabel, IonList, IonButtons
} from '@ionic/react';
import { 
  arrowBack, heart, heartOutline, share, star, checkmark, car, storefront, 
  location, call, chevronForward, chevronBack 
} from 'ionicons/icons';
import { getItemById } from '../../routes/Items.route';
import { useCart } from '../../contexts/Cart.context';

interface Product {
  _id: string;
  name: string;
  code: string;
  codeProduct?: string;
  price: Array<{ date: string; value: number }>;
  img?: string;
  brand?: string;
  stock?: number;
  description?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Imágenes de muestra (en producción vendrían del producto)
  const productImages = [
    product?.img || 'https://via.placeholder.com/400x400?text=Imagen+1',
    'https://via.placeholder.com/400x400?text=Imagen+2',
    'https://via.placeholder.com/400x400?text=Imagen+3',
    'https://via.placeholder.com/400x400?text=Imagen+4',
    'https://via.placeholder.com/400x400?text=Imagen+5'
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getItemById(id);
        console.log('Producto recibido:', res.item);
        setProduct(res.item);
        setError(null);
      } catch (err: any) {
        setProduct(null);
        setError('Error al obtener el producto. Revisa la consola.');
        console.error('Error al obtener producto:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
    }
  };

  const maxQuantity = Math.min(20, product?.stock || 1);
  const currentCartQuantity = product ? getCartItemQuantity(product._id) : 0;
  const canAddMore = currentCartQuantity + quantity <= maxQuantity;

  if (loading) return <IonPage><IonContent>Loading...</IonContent></IonPage>;
  if (error) return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Error</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{error}</p>
          </IonCardContent>
        </IonCard>
        <IonButton routerLink="/home" expand="block">Volver</IonButton>
      </IonContent>
    </IonPage>
  );
  if (!product) return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Producto no encontrado</IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <IonButton routerLink="/home" expand="block">Volver</IonButton>
      </IonContent>
    </IonPage>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton routerLink="/home" fill="clear" color="light">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Detalle del Producto</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" color="light">
              <IonIcon icon={share} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            {/* Columna de imágenes */}
            <IonCol size="12" sizeMd="6">
              <div style={{ padding: '20px' }}>
                {/* Imagen principal */}
                <div style={{ 
                  position: 'relative',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <img 
                    src={productImages[selectedImageIndex]} 
                    alt={product?.name}
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
                  />
                  
                  {/* Botón de favorito */}
                  <IonButton 
                    fill="clear" 
                    style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      right: '10px',
                      '--color': isFavorite ? '#ff4757' : '#8e8e8e'
                    }}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <IonIcon icon={isFavorite ? heart : heartOutline} />
                  </IonButton>
                </div>

                {/* Miniaturas */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  overflowX: 'auto',
                  padding: '8px 0'
                }}>
                  {productImages.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{ 
                        minWidth: '80px',
                        height: '80px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: selectedImageIndex === index ? '2px solid #4A4A4A' : '1px solid #ddd',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px'
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`Vista ${index + 1}`}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </IonCol>

            {/* Columna de información del producto */}
            <IonCol size="12" sizeMd="6">
              <div style={{ padding: '20px' }}>
                {/* Marca */}
                <IonText color="primary">
                  <h3 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {product?.brand || 'LERNEN'}
                  </h3>
                </IonText>

                {/* Nombre del producto */}
                <h1 style={{ 
                  fontSize: '24px', 
                  fontWeight: '400',
                  margin: '0 0 16px 0',
                  lineHeight: '1.3'
                }}>
                  {product?.name}
                </h1>

                {/* Vendido por */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '20px',
                  gap: '8px'
                }}>
                  <IonText color="medium">
                    <small>Vendido por</small>
                  </IonText>
                  <IonText color="primary">
                    <small style={{ fontWeight: 'bold' }}>{product?.brand || 'Lernen'}</small>
                  </IonText>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#4A4A4A',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={checkmark} style={{ color: 'white', fontSize: '12px' }} />
                  </div>
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <IonIcon 
                      key={starNum} 
                      icon={star} 
                      style={{ 
                        color: starNum <= 4 ? '#ffd700' : '#e0e0e0',
                        fontSize: '16px',
                        marginRight: '2px'
                      }}
                    />
                  ))}
                  <IonText color="medium" style={{ marginLeft: '8px' }}>
                    <small>4.6 (827)</small>
                  </IonText>
                </div>

                {/* Precio */}
                <div style={{ marginBottom: '24px' }}>
                  <IonText style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    color: '#2d3436'
                  }}>
                    ${product?.price && product.price.length > 0 
                      ? product.price[product.price.length - 1].value.toLocaleString() 
                      : '0'}
                  </IonText>
                </div>

                {/* Características principales */}
                <div style={{ marginBottom: '24px' }}>
                  <IonText>
                    <h4>Características principales</h4>
                  </IonText>
                  <IonList style={{ '--ion-item-background': 'transparent' }}>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Inalámbrico:</strong> Sí</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Tipo de taladro:</strong> Taladro Inalámbrico</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Uso de la herramienta:</strong> Profesional</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Potencia:</strong> 1500w</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Velocidad:</strong> 2550</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                      <IonLabel>
                        <p><strong>Stock:</strong> {product?.stock || 0} unidades</p>
                      </IonLabel>
                    </IonItem>
                  </IonList>
                  
                  <IonButton fill="clear" size="small" style={{ '--color': '#4A4A4A' }}>
                    Ver más
                    <IonIcon icon={chevronForward} slot="end" />
                  </IonButton>
                </div>

                {/* Selector de cantidad */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <IonText>Cantidad:</IonText>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}>
                    <IonButton 
                      fill="clear" 
                      size="small"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </IonButton>
                    <span style={{ 
                      padding: '0 16px',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {quantity}
                    </span>
                    <IonButton 
                      fill="clear" 
                      size="small"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                    >
                      +
                    </IonButton>
                  </div>
                  <IonText color="medium">
                    <small>Máximo {maxQuantity} unidades</small>
                  </IonText>
                  {currentCartQuantity > 0 && (
                    <IonText color="primary">
                      <small>({currentCartQuantity} en carrito)</small>
                    </IonText>
                  )}
                </div>

                {/* Botón agregar al carrito */}
                <IonButton 
                  expand="block" 
                  color={showAddedToCart ? "success" : "primary"}
                  style={{ 
                    '--background': showAddedToCart ? '#27AE60' : '#0066CC',
                    marginBottom: '16px',
                    height: '48px',
                    fontWeight: 'bold'
                  }}
                  onClick={handleAddToCart}
                  disabled={!canAddMore || (product?.stock || 0) <= 0}
                >
                  {showAddedToCart ? '✓ Agregado al carrito' : 'Agregar al carrito'}
                </IonButton>

                {!canAddMore && (
                  <IonText color="warning">
                    <small>No puedes agregar más de {maxQuantity} unidades</small>
                  </IonText>
                )}

                {/* Botón ver carrito cuando se agrega producto */}
                {showAddedToCart && (
                  <IonButton 
                    expand="block" 
                    fill="outline"
                    color="primary"
                    onClick={() => history.push('/cart')}
                    style={{ marginTop: '8px' }}
                  >
                    Ver Carrito
                  </IonButton>
                )}

                {/* Opciones de envío */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginTop: '20px'
                }}>
                  <div style={{ 
                    flex: 1,
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}>
                    <IonIcon icon={car} style={{ fontSize: '24px', color: '#4A4A4A' }} />
                    <IonText color="medium">
                      <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                        Envío a<br />domicilio
                      </p>
                    </IonText>
                  </div>
                  <div style={{ 
                    flex: 1,
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}>
                    <IonIcon icon={storefront} style={{ fontSize: '24px', color: '#4A4A4A' }} />
                    <IonText color="medium">
                      <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                        Retiro en un<br />punto
                      </p>
                    </IonText>
                  </div>
                  <div style={{ 
                    flex: 1,
                    textAlign: 'center',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}>
                    <IonIcon icon={location} style={{ fontSize: '24px', color: '#4A4A4A' }} />
                    <IonText color="medium">
                      <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                        Stock en tienda
                      </p>
                    </IonText>
                  </div>
                </div>

                {/* Contacto */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '20px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <IonIcon icon={call} style={{ color: '#4A4A4A' }} />
                  <IonText color="medium">
                    <small>¿Te ayudamos? Contáctanos al 600800070</small>
                  </IonText>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail;
