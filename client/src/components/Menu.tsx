import { IonAccordion, IonAccordionGroup, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from "@ionic/react";

export const SideMenu = () => {

  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Menú</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonAccordionGroup>
          {/* Opción 1 - Simple */}
          <IonAccordion value="opcion1">
            <IonItem slot="header" color="light">
              <IonLabel>Herramientas</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonList>
                <IonMenuToggle>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Martillos</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub2">
                    <IonLabel>Destornilladores</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Llaves</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Herramientas Electricas</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Taladros</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Sierras</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Lijadoras</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Materiales de Construccion</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </IonList>
            </div>
          </IonAccordion> 

          {/* Opción 2 - Simple */}
         <IonAccordion value="opcion1">
            <IonItem slot="header" color="light">
              <IonLabel>Materiales</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonList>
                <IonMenuToggle>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Cemento</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub2">
                    <IonLabel>Arena</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Ladrillos</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Acabados</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Pinturas</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Barnices</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Ceramicas</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </IonList>
            </div>
          </IonAccordion> 

          {/* Opción 3 - Sin sub-opciones */}
           <IonAccordion value="opcion1">
            <IonItem slot="header" color="light">
              <IonLabel>Seguridad</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonList>
                <IonMenuToggle>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Casos</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub2">
                    <IonLabel>Guantes</IonLabel>
                  </IonItem>
                  <IonItem button routerLink="/opcion1/sub1">
                    <IonLabel>Lentes de Seguridad</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              </IonList>
            </div>
          </IonAccordion> 

        </IonAccordionGroup>
      </IonContent>
    </IonMenu>
  );
};