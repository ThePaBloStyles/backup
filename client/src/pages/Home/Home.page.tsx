import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import { menuOutline, person, cart } from 'ionicons/icons';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { translations } from '../../locales';
import { Redirect, Route } from 'react-router-dom';
import { SideMenu } from '../../components/Menu';
import { ItemCard } from '../../components/ItemCard';
import { SearchBar } from '../../components/Search';
import { useItem } from '../../contexts/Item.context';


// --- Estructura Principal de la App ---
const AppStructure: React.FC = () => {
  const { items } = useItem();
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const history = useHistory();
  const toggleLocale = () => setLocale(locale === 'es' ? 'en' : 'es');
  const [isLogged, setIsLogged] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    history.push('/login');
  };
  useEffect(() => {
    setIsLogged(!!localStorage.getItem('token'));
  }, []);
  useEffect(() => {
    console.log({ items });
    // Aquí podrías cargar los datos de los items si es necesario
    // Por ejemplo, podrías hacer una llamada a la API para obtener los items
  }, [items]);

  return (
    <>
    <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="dark">
            {/* Botón para abrir el menú */}
            <IonButtons slot="start">
              <IonMenuToggle>
                <IonButton>
                  <IonIcon slot="icon-only" icon={menuOutline} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IonImg
                src="/public/images/images.png" // Reemplaza con la ruta de tu logo
                style={{ width: '100px', height: '40px', marginRight: 12 }}
                alt="Logo"
              />
              <SearchBar placeholder={translations[locale].search} />
              <LanguageSwitcher locale={locale} onToggle={toggleLocale} />
            </div>
            {/* Iconos a la derecha */}
           <IonButtons slot="end">
              {isLogged && (
                <IonButton onClick={handleLogout} color="danger">
                  Cerrar sesión
                </IonButton>
              )}
              <IonButton
                onClick={() => {
                  if (isLogged) {
                    // Verifica el rol guardado en localStorage (puedes guardar el rol en el login)
                    const userRole = localStorage.getItem('userRole');
                    if (userRole === 'administrador') {
                      history.push('/admin');
                    } else {
                      history.push('/home');
                    }
                  } else {
                    history.push('/login');
                  }
                }}
              >
                <IonIcon slot="icon-only" icon={person} />
              </IonButton>
              <IonButton>
                <IonIcon slot="icon-only" icon={cart} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            {/* Aquí se renderizarán las páginas */}
            <IonRouterOutlet>
                <Route path="/opcion1/sub1" render={() => <p>Página de Sub-Opción 1.1</p>} exact={true} />
                <Route path="/opcion1/sub2" render={() => <p>Página de Sub-Opción 1.2</p>} exact={true} />
                <Route path="/opcion2" render={() => <p>Página de Opción 2</p>} exact={true} />
                <Route path="/opcion3" render={() => <p>Página de Opción 3</p>} exact={true} />
                <Redirect exact from="/" to="/opcion1/sub1" />
            </IonRouterOutlet>
            <IonGrid>
              <IonRow>
                {
                  items.map((item: any, index: number) => {
                    console.log({item});
                    return (
                      <IonCol key={index} sizeXl='3' sizeLg='4' sizeMd='6' sizeSm='12'>
                        <ItemCard key={index} item={item}></ItemCard>
                      </IonCol>
                    )
                  })
                }
              </IonRow>
            </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default AppStructure;