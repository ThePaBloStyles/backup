import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonButton } from '@ionic/react';
import axios from 'axios';

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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/items/${id}`);
        console.log('Producto recibido:', res.data.item);
        setProduct(res.data.item);
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
        <IonToolbar>
          <IonTitle>Detalle del Producto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Detalle del Producto</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {product.img ? (
              <img src={product.img} alt={product.name} style={{ maxWidth: 200, maxHeight: 200 }} />
            ) : (
              <span>Sin imagen</span>
            )}
            <ul>
              <li><b>Nombre:</b> {product.name || '-'}</li>
              <li><b>Precio:</b> ${product.price && product.price.length > 0 ? product.price[product.price.length - 1].value : '-'}</li>
              <li><b>Marca:</b> {product.brand || '-'}</li>
              <li><b>Código:</b> {product.code || '-'}</li>
              <li><b>Stock:</b> {product.stock ?? '-'}</li>
              <li><b>ID:</b> {product._id}</li>
              <li><b>Código Producto:</b> {product.codeProduct || '-'}</li>
              <li><b>Descripción:</b> {product.description ? product.description : 'Sin descripción disponible.'}</li>
            </ul>
          </IonCardContent>
        </IonCard>
        <IonButton routerLink="/home" expand="block">Volver</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail;
