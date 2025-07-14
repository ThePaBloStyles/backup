import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react';

const FormulariosPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          {/* 2. Añade el contenedor de botones al inicio de la barra */}
          <IonButtons slot="start">
            {/* 3. Inserta el botón de "volver" con una ruta por defecto */}
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Crear Formularios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>EDITAR FORMULARIOS</h2>
        {/* Aquí puedes agregar la lógica y componentes para mostrar y gestionar los formularios */}
      </IonContent>
    </IonPage>
  );
};

export default FormulariosPage;
