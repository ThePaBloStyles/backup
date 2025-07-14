import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg,
  IonMenuToggle, IonPage, IonRouterOutlet, IonRow, IonToolbar, IonSearchbar,
  IonBadge
} from '@ionic/react';
import { menuOutline, person, cart } from 'ionicons/icons';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { translations } from '../../locales';
import { Redirect, Route } from 'react-router-dom';
import { SideMenu } from '../../components/Menu';
import { ItemCard } from '../../components/ItemCard';
import { SearchBar } from '../../components/Search';
import { useItem } from '../../contexts/Item.context';
import { useCart } from '../../contexts/Cart.context';
import { useAuth } from '../../hooks/useAuth';
import ProductDetail from '../ProductDetail/ProductDetail.page';


// --- Estructura Principal de la App ---
const AppStructure: React.FC = () => {
  const { items } = useItem();
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [searchText, setSearchText] = useState('');
  const history = useHistory();
  const toggleLocale = () => setLocale(locale === 'es' ? 'en' : 'es');
  
  const handleLogout = () => {
    logout();
  };

  const handlePersonClick = () => {
    if (!isAuthenticated) {
      // Si no está logueado, ir al login
      history.push('/login');
    } else if (user?.role === 'administrador' || user?.role === 'bodeguero') {
      // Si es admin o bodeguero, ir al panel de administrador
      history.push('/admin');
    } else {
      // Si es usuario normal, ir al perfil
      history.push('/profile');
    }
  };

  useEffect(() => {
    console.log({ items });
  }, [items]);

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        {/* Header Principal */}
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuToggle>
                <IonButton fill="clear" color="light">
                  <IonIcon slot="icon-only" icon={menuOutline} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
            
            {/* Logo */}
            <div slot="start" style={{ marginLeft: '10px' }}>
              <IonImg
                src="/public/images/images.png"
                style={{ width: '120px', height: '35px' }}
                alt="Logo"
              />
            </div>

            {/* Barra de búsqueda */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1, 
              maxWidth: '500px', 
              margin: '0 20px' 
            }}>
              <IonSearchbar
                value={searchText}
                onIonInput={(e) => setSearchText(e.detail.value!)}
                placeholder="Buscar productos..."
                style={{
                  '--background': 'white',
                  '--color': 'black',
                  '--border-radius': '8px',
                  '--box-shadow': '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            {/* Iconos de la derecha */}
            <IonButtons slot="end">
              {isAuthenticated && (
                <IonButton onClick={handleLogout} color="light">
                  Cerrar sesión
                </IonButton>
              )}
              
              <IonButton fill="clear" color="light" onClick={handlePersonClick}>
                <IonIcon slot="icon-only" icon={person} />
              </IonButton>

              <IonButton 
                fill="clear" 
                color="light" 
                style={{ position: 'relative' }}
                onClick={() => history.push('/cart')}
              >
                <IonIcon slot="icon-only" icon={cart} />
                {cartCount > 0 && (
                  <IonBadge 
                    color="danger" 
                    style={{ 
                      position: 'absolute', 
                      top: '-5px', 
                      right: '-5px',
                      fontSize: '10px',
                      minWidth: '18px',
                      height: '18px'
                    }}
                  >
                    {cartCount}
                  </IonBadge>
                )}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {/* Contenido principal */}
          <IonRouterOutlet>
            <Route path="/opcion1/sub1" render={() => <p>Página de Sub-Opción 1.1</p>} exact={true} />
            <Route path="/opcion1/sub2" render={() => <p>Página de Sub-Opción 1.2</p>} exact={true} />
            <Route path="/opcion2" render={() => <p>Página de Opción 2</p>} exact={true} />
            <Route path="/opcion3" render={() => <p>Página de Opción 3</p>} exact={true} />
            <Route path="/product/:id" component={ProductDetail} exact={true} />
            <Redirect exact from="/" to="/opcion1/sub1" />
          </IonRouterOutlet>

          {/* Grid de productos */}
          <IonGrid>
            <IonRow>
              {items.map((item: any, index: number) => {
                console.log({ item });
                return (
                  <IonCol key={index} sizeXl='3' sizeLg='4' sizeMd='6' sizeSm='12'>
                    <ItemCard key={index} item={item}></ItemCard>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default AppStructure;