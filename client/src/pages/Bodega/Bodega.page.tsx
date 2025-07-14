

import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonModal, IonInput, IonText, IonIcon, IonAlert, IonFab, IonFabButton
} from '@ionic/react';
import { add, create, trash } from 'ionicons/icons';
import axios from 'axios';

const initialProduct = {
  codeProduct: '',
  brand: '',
  code: '',
  name: '',
  price: [{ date: new Date(), value: 0 }],
  img: '',
  stock: 0,
  state: true
};

const BodegaPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [form, setForm] = useState<any>(initialProduct);
  const [fileImg, setFileImg] = useState<File|null>(null);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/items');
      setProducts(res.data);
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      let imgUrl = form.img;
      if (fileImg) {
        // Simulación de subida de imagen (debes implementar el endpoint real en el backend)
        const data = new FormData();
        data.append('file', fileImg);
        // Ejemplo: const res = await axios.post('/api/upload', data);
        // imgUrl = res.data.url;
        imgUrl = URL.createObjectURL(fileImg); // Solo para mostrar en frontend
      }
      const payload = { ...form, img: imgUrl };
      await axios.post('/api/items', payload);
      setShowModal(false);
      setForm(initialProduct);
      setFileImg(null);
      fetchProducts();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al agregar producto';
      setError(msg + (err?.response?.data?.error ? ': ' + JSON.stringify(err.response.data.error) : ''));
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setForm({ ...product, price: product.price || [{ date: new Date(), value: 0 }] });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/items?id=${selectedProduct._id}`, form);
      setShowEditModal(false);
      setSelectedProduct(null);
      setForm(initialProduct);
      fetchProducts();
    } catch (err) {
      setError('Error al actualizar producto');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/items?id=${selectedProduct._id}`);
      setShowDeleteAlert(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Administrar Bodega</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => { setForm(initialProduct); setFileImg(null); setShowModal(true); }} color="success">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonGrid>
          <IonRow>
            {products.length === 0 && (
              <IonCol size="12"><IonText>No hay productos</IonText></IonCol>
            )}
            {products.map((prod) => (
              <IonCol key={prod._id} size="12" sizeMd="4" sizeLg="3">
                <div style={{ position: 'relative' }}>
                  <div style={{width: '100%', height: 200, textAlign: 'center'}}>
                    <img height={200} alt={prod.name} src={prod.img || 'https://via.placeholder.com/200?text=Sin+Imagen'} />
                  </div>
                  <div style={{padding: '10px'}}>
                    <b>{prod.name}</b><br />
                    Código: {prod.codeProduct} | Marca: {prod.brand}<br />
                    Stock: {prod.stock} | Precio: ${prod.price?.[0]?.value ?? 0}
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
                    <IonButton fill="clear" color="primary" onClick={() => handleEdit(prod)}>
                      <IonIcon icon={create} />
                    </IonButton>
                    <IonButton fill="clear" color="danger" onClick={() => { setSelectedProduct(prod); setShowDeleteAlert(true); }}>
                      <IonIcon icon={trash} />
                    </IonButton>
                  </div>
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Modal para agregar producto */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Producto</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput label="Nombre" name="name" value={form.name} onIonChange={handleInput} />
            <IonInput label="Código" name="codeProduct" value={form.codeProduct} onIonChange={handleInput} />
            <IonInput label="Marca" name="brand" value={form.brand} onIonChange={handleInput} />
            <IonInput label="Stock" name="stock" type="number" value={form.stock} onIonChange={handleInput} />
            <IonInput label="Precio" name="price" type="number" value={form.price[0]?.value} onIonChange={e => setForm((prev: any) => ({ ...prev, price: [{ date: new Date(), value: Number(e.detail.value) }] }))} />
            <IonInput label="Imagen (URL)" name="img" value={form.img} onIonChange={handleInput} />
            <input type="file" accept="image/*" onChange={e => setFileImg(e.target.files?.[0] || null)} style={{marginTop:10, marginBottom:10}} />
            <IonButton expand="block" onClick={handleAdd} color="success">Agregar</IonButton>
            <IonButton expand="block" fill="outline" onClick={() => { setForm(initialProduct); setFileImg(null); }}>Limpiar</IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setShowModal(false)}>Cancelar</IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para editar producto */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Producto</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput label="Nombre" name="name" value={form.name} onIonChange={handleInput} />
            <IonInput label="Código" name="codeProduct" value={form.codeProduct} onIonChange={handleInput} />
            <IonInput label="Marca" name="brand" value={form.brand} onIonChange={handleInput} />
            <IonInput label="Stock" name="stock" type="number" value={form.stock} onIonChange={handleInput} />
            <IonInput label="Precio" name="price" type="number" value={form.price[0]?.value} onIonChange={e => setForm((prev: any) => ({ ...prev, price: [{ date: new Date(), value: Number(e.detail.value) }] }))} />
            <IonInput label="Imagen (URL)" name="img" value={form.img} onIonChange={handleInput} />
            <IonButton expand="block" onClick={handleUpdate} color="primary">Guardar Cambios</IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setShowEditModal(false)}>Cancelar</IonButton>
          </IonContent>
        </IonModal>

        {/* Alerta de confirmación para eliminar */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="¿Eliminar producto?"
          message={`¿Seguro que deseas eliminar el producto \"${selectedProduct?.name}\"?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setShowDeleteAlert(false)
            },
            {
              text: 'Eliminar',
              handler: handleDelete,
              cssClass: 'danger'
            }
          ]}
        />

        {error && <IonText color="danger"><p>{error}</p></IonText>}
        {error && <pre style={{color:'red', fontSize:12}}>{error}</pre>}
      </IonContent>
    </IonPage>
  );
};

export default BodegaPage;
