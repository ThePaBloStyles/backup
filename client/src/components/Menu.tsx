import { IonAccordion, IonAccordionGroup, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from "@ionic/react";

export const SideMenu = () => {

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar className="menu-toolbar">
            <IonTitle>Menú</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="menu-content">
          <IonAccordionGroup>
            {/* Opción 1 - Simple */}
            <IonAccordion value="opcion1">
              <IonItem slot="header" className="menu-header-item">
                <IonLabel>Herramientas</IonLabel>
              </IonItem>
              <div className="ion-padding menu-content-section" slot="content">
                <IonList>
                  <IonMenuToggle>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Martillos</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub2" className="menu-sub-item">
                      <IonLabel>Destornilladores</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Llaves</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Herramientas Electricas</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Taladros</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Sierras</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Lijadoras</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Materiales de Construccion</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                </IonList>
              </div>
            </IonAccordion> 

            {/* Opción 2 - Simple */}
           <IonAccordion value="opcion2">
              <IonItem slot="header" className="menu-header-item">
                <IonLabel>Materiales</IonLabel>
              </IonItem>
              <div className="ion-padding menu-content-section" slot="content">
                <IonList>
                  <IonMenuToggle>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Cemento</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub2" className="menu-sub-item">
                      <IonLabel>Arena</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Ladrillos</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Acabados</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Pinturas</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Barnices</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Ceramicas</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                </IonList>
              </div>
            </IonAccordion> 

            {/* Opción 3 - Sin sub-opciones */}
             <IonAccordion value="opcion3">
              <IonItem slot="header" className="menu-header-item">
                <IonLabel>Seguridad</IonLabel>
              </IonItem>
              <div className="ion-padding menu-content-section" slot="content">
                <IonList>
                  <IonMenuToggle>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Casos</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub2" className="menu-sub-item">
                      <IonLabel>Guantes</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/opcion1/sub1" className="menu-sub-item">
                      <IonLabel>Lentes de Seguridad</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                </IonList>
              </div>
            </IonAccordion> 

          </IonAccordionGroup>
        </IonContent>
      </IonMenu>
      
      <style>{`
        /* Estilos para el menú lateral */
        .menu-toolbar {
          --background: #2c3e50;
          --color: white;
        }
        
        .menu-content {
          --background: #34495e;
        }
        
        .menu-header-item {
          --background: #4a5568;
          --color: white;
          --border-color: #5a6c7d;
          font-weight: 600;
        }
        
        .menu-content-section {
          --background: #2d3748;
        }
        
        .menu-sub-item {
          --background: transparent;
          --color: #e2e8f0;
          --border-color: #4a5568;
          padding-left: 20px;
        }
        
        .menu-sub-item:hover {
          --background: rgba(255, 255, 255, 0.1);
        }
        
        /* Estilos para modo oscuro */
        @media (prefers-color-scheme: dark) {
          .menu-toolbar {
            --background: #1a1a1a;
            --color: #e0e0e0;
          }
          
          .menu-content {
            --background: #0d1117;
          }
          
          .menu-header-item {
            --background: #21262d;
            --color: #f0f6fc;
            --border-color: #30363d;
          }
          
          .menu-content-section {
            --background: #161b22;
          }
          
          .menu-sub-item {
            --background: transparent;
            --color: #c9d1d9;
            --border-color: #30363d;
          }
          
          .menu-sub-item:hover {
            --background: rgba(255, 255, 255, 0.05);
          }
        }
      `}</style>
    </>
  );
};