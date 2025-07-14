    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react';
    
    const ResultadosPage: React.FC = () => {
      return (
        <IonPage>
          <IonHeader>
            <IonToolbar color="primary">
              {/* 2. Añade el contenedor de botones al inicio de la barra */}
              <IonButtons slot="start">
                {/* 3. Inserta el botón de "volver" con una ruta por defecto */}
                <IonBackButton defaultHref="/home" />
              </IonButtons>
              <IonTitle>Resultados</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <h2>Vista de resultados</h2>
            {/* Aquí puedes agregar la lógica y componentes para mostrar y gestionar los formularios */}
          </IonContent>
        </IonPage>
      );
    };
    
    export default ResultadosPage;
    