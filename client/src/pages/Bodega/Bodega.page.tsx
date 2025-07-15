

import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonModal, IonInput, IonText, IonIcon, IonAlert, IonFab, IonFabButton, IonChip, IonSelect, IonSelectOption, IonSearchbar
} from '@ionic/react';
import { add, create, trash, storefront, cube, pricetag, albums, search, filter, analytics, settings, checkmark, close, camera, star, diamond, trophy, flash, home, bag, barcode, cash, archive } from 'ionicons/icons';
import axios from 'axios';
import './Bodega.styles.css';

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
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [form, setForm] = useState<any>(initialProduct);
  const [fileImg, setFileImg] = useState<File|null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Función para obtener estadísticas
  const getStats = () => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
    const lowStock = products.filter(product => product.stock < 10).length;
    const outOfStock = products.filter(product => product.stock === 0).length;
    const averagePrice = products.length > 0 ? products.reduce((sum, product) => sum + (product.price?.[0]?.value || 0), 0) / products.length : 0;
    
    return {
      totalProducts,
      totalStock,
      lowStock,
      outOfStock,
      averagePrice: averagePrice.toFixed(2)
    };
  };

  // Función para obtener marcas únicas
  const getUniqueBrands = () => {
    const brands = products.map(product => product.brand).filter(Boolean);
    return [...new Set(brands)];
  };

  // Función para filtrar productos
  const filterProducts = () => {
    let filtered = [...products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codeProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por marca
    if (filterBrand) {
      filtered = filtered.filter(product => product.brand === filterBrand);
    }

    // Filtrar por stock
    if (filterStock) {
      switch (filterStock) {
        case 'high':
          filtered = filtered.filter(product => product.stock >= 20);
          break;
        case 'medium':
          filtered = filtered.filter(product => product.stock >= 10 && product.stock < 20);
          break;
        case 'low':
          filtered = filtered.filter(product => product.stock > 0 && product.stock < 10);
          break;
        case 'out':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }

    // Ordenar productos
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        filtered.sort((a, b) => (b.price?.[0]?.value || 0) - (a.price?.[0]?.value || 0));
        break;
      case 'stock':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case 'brand':
        filtered.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
    }

    setFilteredProducts(filtered);
  };

  // Función para obtener el estado del stock
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', label: 'Agotado', color: 'out' };
    if (stock < 10) return { status: 'low', label: 'Stock Bajo', color: 'low' };
    if (stock < 20) return { status: 'medium', label: 'Stock Medio', color: 'medium' };
    return { status: 'high', label: 'Buen Stock', color: 'high' };
  };

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterBrand, filterStock, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/items');
      setProducts(res.data);
      setError('');
    } catch (err) {
      setError('Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
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
      // Validación básica
      if (!form.name || !form.code) {
        setError('Por favor, completa al menos el nombre y el código único del producto');
        return;
      }

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
      setError(''); // Limpiar error al éxito
      fetchProducts();
    } catch (err: any) {
      console.error('Error completo:', err);
      
      if (err?.response?.status === 400 && err?.response?.data?.message?.includes('duplicate key')) {
        setError(`El código "${form.code}" ya existe. Por favor, usa un código único diferente.`);
      } else if (err?.response?.data?.message?.includes('E11000')) {
        setError(`Ya existe un producto con ese código. Por favor, usa un código único diferente.`);
      } else {
        const msg = err?.response?.data?.message || 'Error al agregar producto';
        setError(msg);
      }
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setForm({ ...product, price: product.price || [{ date: new Date(), value: 0 }] });
    setShowEditModal(true);
    setError('');
  };

  const handleUpdate = async () => {
    try {
      let imgUrl = form.img;
      if (fileImg) {
        imgUrl = URL.createObjectURL(fileImg); // Solo para mostrar en frontend
      }
      const payload = { ...form, img: imgUrl };
      await axios.put(`/api/items?id=${selectedProduct._id}`, payload);
      setShowEditModal(false);
      setSelectedProduct(null);
      setForm(initialProduct);
      setFileImg(null);
      setError('');
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

  const resetForm = () => {
    setForm(initialProduct);
    setFileImg(null);
    setError('');
  };

  const stats = getStats();
  const uniqueBrands = getUniqueBrands();


  return (
    <IonPage className="bodega-page">
      <IonContent className="bodega-content" scrollY={true} fullscreen={true}>
        {/* Header de bienvenida */}
        <div className="bodega-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <IonIcon icon={star} style={{ color: '#ffeaa7', fontSize: '24px' }} />
            <h1 className="bodega-title">Administrar Bodega</h1>
            <IonIcon icon={star} style={{ color: '#ffeaa7', fontSize: '24px' }} />
          </div>
          <p className="bodega-subtitle">
            <IonIcon icon={storefront} style={{ marginRight: '8px' }} />
            Gestiona tu inventario de productos de manera eficiente
          </p>
        </div>

        {/* Estadísticas */}
        <div className="bodega-stats">
          <div className="bodega-stat-card">
            <IonIcon icon={cube} className="bodega-stat-icon" />
            <div className="bodega-stat-value">{stats.totalProducts}</div>
            <div className="bodega-stat-label">Total Productos</div>
          </div>
          <div className="bodega-stat-card">
            <IonIcon icon={albums} className="bodega-stat-icon" />
            <div className="bodega-stat-value">{stats.totalStock}</div>
            <div className="bodega-stat-label">Total Stock</div>
          </div>
          <div className="bodega-stat-card">
            <IonIcon icon={cash} className="bodega-stat-icon" />
            <div className="bodega-stat-value">${stats.averagePrice}</div>
            <div className="bodega-stat-label">Precio Promedio</div>
          </div>
          <div className="bodega-stat-card">
            <IonIcon icon={analytics} className="bodega-stat-icon" />
            <div className="bodega-stat-value">{stats.lowStock}</div>
            <div className="bodega-stat-label">Stock Bajo</div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="bodega-actions">
          <IonButton
            className="bodega-action-button success"
            onClick={() => { resetForm(); setShowModal(true); }}
            expand="block"
          >
            <IonIcon icon={add} slot="start" />
            Agregar Producto
          </IonButton>
          <IonButton
            className="bodega-action-button"
            routerLink="/admin"
            expand="block"
          >
            <IonIcon icon={home} slot="start" />
            Volver al Panel
          </IonButton>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bodega-filters">
          <div className="bodega-filters-grid">
            <div className="bodega-filter-group">
              <label className="bodega-filter-label">Buscar Productos</label>
              <IonSearchbar
                className="bodega-filter-input"
                value={searchTerm}
                onIonInput={(e) => setSearchTerm(e.detail.value!)}
                placeholder="Buscar por nombre, código o marca..."
                showClearButton="focus"
              />
            </div>
            <div className="bodega-filter-group">
              <label className="bodega-filter-label">Filtrar por Marca</label>
              <IonSelect
                className="bodega-filter-input"
                value={filterBrand}
                placeholder="Todas las marcas"
                onIonChange={(e) => setFilterBrand(e.detail.value)}
              >
                <IonSelectOption value="">Todas las marcas</IonSelectOption>
                {uniqueBrands.map(brand => (
                  <IonSelectOption key={brand} value={brand}>{brand}</IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <div className="bodega-filter-group">
              <label className="bodega-filter-label">Filtrar por Stock</label>
              <IonSelect
                className="bodega-filter-input"
                value={filterStock}
                placeholder="Todos los stocks"
                onIonChange={(e) => setFilterStock(e.detail.value)}
              >
                <IonSelectOption value="">Todos los stocks</IonSelectOption>
                <IonSelectOption value="high">Buen Stock (20+)</IonSelectOption>
                <IonSelectOption value="medium">Stock Medio (10-19)</IonSelectOption>
                <IonSelectOption value="low">Stock Bajo (1-9)</IonSelectOption>
                <IonSelectOption value="out">Agotado (0)</IonSelectOption>
              </IonSelect>
            </div>
            <div className="bodega-filter-group">
              <label className="bodega-filter-label">Ordenar por</label>
              <IonSelect
                className="bodega-filter-input"
                value={sortBy}
                onIonChange={(e) => setSortBy(e.detail.value)}
              >
                <IonSelectOption value="name">Nombre</IonSelectOption>
                <IonSelectOption value="price">Precio</IonSelectOption>
                <IonSelectOption value="stock">Stock</IonSelectOption>
                <IonSelectOption value="brand">Marca</IonSelectOption>
              </IonSelect>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="bodega-loading">
            <IonIcon icon={settings} className="bodega-loading-icon" />
            <h2>Cargando productos...</h2>
            <p>Por favor espera mientras cargamos tu inventario</p>
          </div>
        ) : error && products.length === 0 ? (
          <div className="bodega-empty">
            <IonIcon icon={archive} className="bodega-empty-icon" />
            <h2 className="bodega-empty-title">Error al cargar productos</h2>
            <p className="bodega-empty-subtitle">{error}</p>
            <IonButton
              className="bodega-action-button"
              onClick={fetchProducts}
            >
              <IonIcon icon={settings} slot="start" />
              Reintentar
            </IonButton>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bodega-empty">
            <IonIcon icon={cube} className="bodega-empty-icon" />
            <h2 className="bodega-empty-title">
              {products.length === 0 ? 'No hay productos' : 'No se encontraron productos'}
            </h2>
            <p className="bodega-empty-subtitle">
              {products.length === 0 
                ? 'Comienza agregando tu primer producto a la bodega' 
                : 'Prueba cambiando los filtros o términos de búsqueda'
              }
            </p>
            {products.length === 0 && (
              <IonButton
                className="bodega-action-button success"
                onClick={() => { resetForm(); setShowModal(true); }}
              >
                <IonIcon icon={add} slot="start" />
                Agregar Primer Producto
              </IonButton>
            )}
          </div>
        ) : (
          <div className="bodega-products-grid">
            {filteredProducts.map((product: any) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div key={product._id} className="bodega-product-card bodega-fade-in">
                  <div className="bodega-product-image">
                    <img
                      src={product.img || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
                      alt={product.name}
                    />
                    <div className={`bodega-stock-indicator ${stockStatus.color}`}>
                      {stockStatus.label}
                    </div>
                    <div className="bodega-product-actions">
                      <IonButton
                        className="bodega-product-action edit"
                        onClick={() => handleEdit(product)}
                      >
                        <IonIcon icon={create} />
                      </IonButton>
                      <IonButton
                        className="bodega-product-action delete"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteAlert(true);
                        }}
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </div>
                  </div>
                  <div className="bodega-product-info">
                    <h3 className="bodega-product-name">{product.name}</h3>
                    <div className="bodega-product-details">
                      <div className="bodega-product-detail">
                        <IonIcon icon={barcode} className="bodega-product-detail-icon" />
                        <span>{product.codeProduct}</span>
                      </div>
                      <div className="bodega-product-detail">
                        <IonIcon icon={diamond} className="bodega-product-detail-icon" />
                        <span>{product.brand}</span>
                      </div>
                    </div>
                    <div className="bodega-product-footer">
                      <div className="bodega-product-price">
                        ${product.price?.[0]?.value ?? 0}
                      </div>
                      <div className={`bodega-product-stock ${stockStatus.status}`}>
                        <IonIcon icon={cube} />
                        <span>{product.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal para agregar producto */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <div className="bodega-modal-content">
            <div className="bodega-modal-header">
              <h2 className="bodega-modal-title">Agregar Nuevo Producto</h2>
            </div>
            <div className="bodega-modal-body">
              <div className="bodega-form-group">
                <label className="bodega-form-label">Nombre del Producto</label>
                <IonInput
                  className="bodega-form-input"
                  name="name"
                  value={form.name}
                  onIonChange={handleInput}
                  placeholder="Ingresa el nombre del producto"
                />
              </div>
              
              <div className="bodega-form-group">
                <label className="bodega-form-label">Código del Producto</label>
                <IonInput
                  className="bodega-form-input"
                  name="codeProduct"
                  value={form.codeProduct}
                  onIonChange={handleInput}
                  placeholder="Código interno del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Código Único</label>
                <IonInput
                  className="bodega-form-input"
                  name="code"
                  value={form.code}
                  onIonChange={handleInput}
                  placeholder="Código único identificador"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Marca</label>
                <IonInput
                  className="bodega-form-input"
                  name="brand"
                  value={form.brand}
                  onIonChange={handleInput}
                  placeholder="Marca del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Stock</label>
                <IonInput
                  className="bodega-form-input"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onIonChange={handleInput}
                  placeholder="Cantidad en stock"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Precio</label>
                <IonInput
                  className="bodega-form-input"
                  name="price"
                  type="number"
                  value={form.price[0]?.value}
                  onIonChange={e => setForm((prev: any) => ({ 
                    ...prev, 
                    price: [{ date: new Date(), value: Number(e.detail.value) }] 
                  }))}
                  placeholder="Precio del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">URL de Imagen</label>
                <IonInput
                  className="bodega-form-input"
                  name="img"
                  value={form.img}
                  onIonChange={handleInput}
                  placeholder="URL de la imagen del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Subir Imagen</label>
                <div className="bodega-form-file">
                  <IonIcon icon={camera} style={{ fontSize: '2rem', marginBottom: '10px' }} />
                  <p>Haz clic para seleccionar una imagen</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFileImg(e.target.files?.[0] || null)}
                  />
                </div>
                {fileImg && (
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    Archivo seleccionado: {fileImg.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="bodega-error">
                  <IonIcon icon={close} className="bodega-error-icon" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bodega-form-actions">
                <IonButton
                  className="bodega-form-button primary"
                  onClick={handleAdd}
                >
                  <IonIcon icon={checkmark} slot="start" />
                  Agregar Producto
                </IonButton>
                <IonButton
                  className="bodega-form-button secondary"
                  onClick={resetForm}
                >
                  <IonIcon icon={close} slot="start" />
                  Limpiar
                </IonButton>
                <IonButton
                  className="bodega-form-button secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </IonButton>
              </div>
            </div>
          </div>
        </IonModal>

        {/* Modal para editar producto */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <div className="bodega-modal-content">
            <div className="bodega-modal-header">
              <h2 className="bodega-modal-title">Editar Producto</h2>
            </div>
            <div className="bodega-modal-body">
              <div className="bodega-form-group">
                <label className="bodega-form-label">Nombre del Producto</label>
                <IonInput
                  className="bodega-form-input"
                  name="name"
                  value={form.name}
                  onIonChange={handleInput}
                  placeholder="Ingresa el nombre del producto"
                />
              </div>
              
              <div className="bodega-form-group">
                <label className="bodega-form-label">Código del Producto</label>
                <IonInput
                  className="bodega-form-input"
                  name="codeProduct"
                  value={form.codeProduct}
                  onIonChange={handleInput}
                  placeholder="Código interno del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Código Único</label>
                <IonInput
                  className="bodega-form-input"
                  name="code"
                  value={form.code}
                  onIonChange={handleInput}
                  placeholder="Código único identificador"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Marca</label>
                <IonInput
                  className="bodega-form-input"
                  name="brand"
                  value={form.brand}
                  onIonChange={handleInput}
                  placeholder="Marca del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Stock</label>
                <IonInput
                  className="bodega-form-input"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onIonChange={handleInput}
                  placeholder="Cantidad en stock"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Precio</label>
                <IonInput
                  className="bodega-form-input"
                  name="price"
                  type="number"
                  value={form.price[0]?.value}
                  onIonChange={e => setForm((prev: any) => ({ 
                    ...prev, 
                    price: [{ date: new Date(), value: Number(e.detail.value) }] 
                  }))}
                  placeholder="Precio del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">URL de Imagen</label>
                <IonInput
                  className="bodega-form-input"
                  name="img"
                  value={form.img}
                  onIonChange={handleInput}
                  placeholder="URL de la imagen del producto"
                />
              </div>

              <div className="bodega-form-group">
                <label className="bodega-form-label">Subir Nueva Imagen</label>
                <div className="bodega-form-file">
                  <IonIcon icon={camera} style={{ fontSize: '2rem', marginBottom: '10px' }} />
                  <p>Haz clic para seleccionar una imagen</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFileImg(e.target.files?.[0] || null)}
                  />
                </div>
                {fileImg && (
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    Archivo seleccionado: {fileImg.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="bodega-error">
                  <IonIcon icon={close} className="bodega-error-icon" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bodega-form-actions">
                <IonButton
                  className="bodega-form-button primary"
                  onClick={handleUpdate}
                >
                  <IonIcon icon={checkmark} slot="start" />
                  Guardar Cambios
                </IonButton>
                <IonButton
                  className="bodega-form-button secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </IonButton>
              </div>
            </div>
          </div>
        </IonModal>

        {/* Alerta de confirmación para eliminar */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="¿Eliminar producto?"
          message={`¿Seguro que deseas eliminar el producto "${selectedProduct?.name}"?`}
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
      </IonContent>
    </IonPage>
  );
};

export default BodegaPage;
