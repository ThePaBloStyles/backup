import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            {user?.role === 'bodeguero' ? 'Panel de Bodeguero' : 'Panel de Administrador'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{textAlign: 'center', margin: '20px 0'}}>
          <h2>
            Bienvenido {user?.role === 'bodeguero' ? 'Bodeguero' : 'SuperAdmin'}
          </h2>
          {user?.role !== 'bodeguero' && (
            <>
              <IonButton color="tertiary" onClick={() => alert('Panel Ferramax')}>Administrar Ferramax</IonButton>
              <IonButton color="primary" style={{marginLeft: 10}} routerLink="/home">Ir al Home</IonButton>
            </>
          )}
          {user?.role === 'bodeguero' && (
            <IonButton color="primary" routerLink="/home">Ir al Home</IonButton>
          )}
        </div>
        <IonList>
          {/* Administrar usuarios - Solo para administradores */}
          {user?.role === 'administrador' && (
            <IonItem button onClick={() => history.push('/admUsuarios')}>
              <IonLabel>Administrar usuarios</IonLabel>
            </IonItem>
          )}
          
          {/* Administrar bodega - Para bodegueros y administradores */}
          {(user?.role === 'bodeguero' || user?.role === 'administrador') && (
            <IonItem button onClick={() => history.push('/bodega')}>
              <IonLabel>Administrar bodega</IonLabel>
            </IonItem>
          )}
          
          {/* Editor de productos - Solo para administradores */}
          {user?.role === 'administrador' && (
            <IonItem button onClick={() => history.push('/admin/products')}>
              <IonLabel>Editor de productos</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
