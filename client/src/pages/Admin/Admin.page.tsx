import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Panel de Administrador</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{textAlign: 'center', margin: '20px 0'}}>
          <h2>Bienvenido SuperAdmin</h2>
          <IonButton color="tertiary" onClick={() => alert('Panel Ferramax')}>Administrar Ferramax</IonButton>
          <IonButton color="primary" style={{marginLeft: 10}} routerLink="/home">Ir al Home</IonButton>
        </div>
        <IonList>
          <IonItem button onClick={() => history.push('/admUsuarios')}>
            <IonLabel>Administrar usuarios</IonLabel>
          </IonItem>
          <IonItem button onClick={() => history.push('/bodega')}>
            <IonLabel>Administrar bodega</IonLabel>
          </IonItem>
          <IonItem button onClick={() => history.push('/admin/products')}>
            <IonLabel>Editor de productos</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
