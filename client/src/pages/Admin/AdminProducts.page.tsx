import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const AdminProductsPage: React.FC = () => {
  // Aquí iría la lógica para editar productos
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Editor de Productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Aquí muestra la lista de productos y opciones para editar, eliminar, agregar, etc. */}
        <div>Editor de productos aquí...</div>
      </IonContent>
    </IonPage>
  );
};

export default AdminProductsPage;
