import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const BodegaPage: React.FC = () => {
  // Aquí iría la lógica para ver el stock y administrar la bodega
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Administrar Bodega</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Aquí muestra el stock y opciones para el bodeguero */}
        <div>Vista de bodega aquí...</div>
      </IonContent>
    </IonPage>
  );
};

export default BodegaPage;
