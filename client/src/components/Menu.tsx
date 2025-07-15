import { IonAccordion, IonAccordionGroup, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar, IonButton, IonIcon, IonChip } from "@ionic/react";
import { close, funnel } from "ionicons/icons";

interface SideMenuProps {
  onCategoryFilter?: (category: string) => void;
  onSubcategoryFilter?: (subcategory: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
  onClearFilters?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  onCategoryFilter,
  onSubcategoryFilter,
  selectedCategory,
  selectedSubcategory,
  onClearFilters
}) => {

  const handleCategoryClick = (category: string) => {
    if (onCategoryFilter) {
      onCategoryFilter(category);
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    if (onSubcategoryFilter) {
      onSubcategoryFilter(subcategory);
    }
  };

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar className="menu-toolbar">
            <IonTitle>
              <div className="menu-title-container">
                <IonIcon icon={funnel} className="menu-filter-icon" />
                Filtros
              </div>
            </IonTitle>
            {(selectedCategory || selectedSubcategory) && (
              <IonButton 
                slot="end" 
                fill="clear" 
                size="small"
                onClick={onClearFilters}
                className="clear-filters-button"
              >
                <IonIcon icon={close} />
              </IonButton>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent className="menu-content">
          {/* Filtros activos */}
          {(selectedCategory || selectedSubcategory) && (
            <div className="active-filters">
              <IonLabel className="active-filters-label">Filtros activos:</IonLabel>
              {selectedCategory && (
                <IonChip color="primary" className="filter-chip">
                  <IonLabel>{selectedCategory}</IonLabel>
                  <IonIcon 
                    icon={close} 
                    onClick={() => handleCategoryClick('')}
                    className="filter-chip-close"
                  />
                </IonChip>
              )}
              {selectedSubcategory && (
                <IonChip color="secondary" className="filter-chip">
                  <IonLabel>{selectedSubcategory}</IonLabel>
                  <IonIcon 
                    icon={close} 
                    onClick={() => handleSubcategoryClick('')}
                    className="filter-chip-close"
                  />
                </IonChip>
              )}
            </div>
          )}
          <IonAccordionGroup>
            {/* Opción 1 - Herramientas */}
            <IonAccordion value="herramientas">
              <IonItem 
                slot="header" 
                className={`menu-header-item ${selectedCategory === 'herramientas' ? 'active' : ''}`}
                button
                onClick={() => handleCategoryClick('herramientas')}
              >
                <IonLabel>Herramientas</IonLabel>
              </IonItem>
              <div className="ion-padding menu-content-section" slot="content">
                <IonList>
                  <IonMenuToggle>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'martillos' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('martillos')}
                    >
                      <IonLabel>Martillos</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'destornilladores' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('destornilladores')}
                    >
                      <IonLabel>Destornilladores</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'llaves' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('llaves')}
                    >
                      <IonLabel>Llaves</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'herramientas electricas' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('herramientas electricas')}
                    >
                      <IonLabel>Herramientas Eléctricas</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'taladros' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('taladros')}
                    >
                      <IonLabel>Taladros</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'sierras' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('sierras')}
                    >
                      <IonLabel>Sierras</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'lijadoras' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('lijadoras')}
                    >
                      <IonLabel>Lijadoras</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                </IonList>
              </div>
            </IonAccordion> 

            {/* Opción 2 - Materiales */}
           <IonAccordion value="materiales">
              <IonItem 
                slot="header" 
                className={`menu-header-item ${selectedCategory === 'materiales' ? 'active' : ''}`}
                button
                onClick={() => handleCategoryClick('materiales')}
              >
                <IonLabel>Materiales</IonLabel>
              </IonItem>
              <div className="ion-padding menu-content-section" slot="content">
                <IonList>
                  <IonMenuToggle>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'cemento' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('cemento')}
                    >
                      <IonLabel>Cemento</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'arena' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('arena')}
                    >
                      <IonLabel>Arena</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'ladrillos' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('ladrillos')}
                    >
                      <IonLabel>Ladrillos</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'acabados' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('acabados')}
                    >
                      <IonLabel>Acabados</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'pinturas' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('pinturas')}
                    >
                      <IonLabel>Pinturas</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'barnices' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('barnices')}
                    >
                      <IonLabel>Barnices</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'ceramicas' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('ceramicas')}
                    >
                      <IonLabel>Cerámicas</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                </IonList>
              </div>
            </IonAccordion> 

            {/* Opción 3 - Seguridad */}
             <IonAccordion value="seguridad">
              <IonItem 
                slot="header" 
                className={`menu-header-item ${selectedCategory === 'seguridad' ? 'active' : ''}`}
                button
                onClick={() => handleCategoryClick('seguridad')}
              >
                <IonLabel>Seguridad</IonLabel>
              </IonItem>
              <div className="ion-padding menu-content-section" slot="content">
                <IonList>
                  <IonMenuToggle>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'cascos' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('cascos')}
                    >
                      <IonLabel>Cascos</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'guantes' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('guantes')}
                    >
                      <IonLabel>Guantes</IonLabel>
                    </IonItem>
                    <IonItem 
                      button 
                      className={`menu-sub-item ${selectedSubcategory === 'lentes de seguridad' ? 'active' : ''}`}
                      onClick={() => handleSubcategoryClick('lentes de seguridad')}
                    >
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
          padding: 0 16px;
        }
        
        .menu-title-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .menu-filter-icon {
          font-size: 20px;
        }
        
        .clear-filters-button {
          --color: #e74c3c;
          --background-hover: rgba(231, 76, 60, 0.1);
        }
        
        .menu-content {
          --background: #34495e;
        }
        
        .active-filters {
          padding: 16px;
          background: rgba(52, 73, 94, 0.8);
          border-bottom: 1px solid #4a5568;
        }
        
        .active-filters-label {
          display: block;
          color: #bdc3c7;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .filter-chip {
          margin: 4px 4px 4px 0;
          --background: rgba(52, 152, 219, 0.2);
          --color: #3498db;
          cursor: pointer;
        }
        
        .filter-chip ion-label {
          font-size: 12px;
          font-weight: 500;
        }
        
        .filter-chip-close {
          margin-left: 4px;
          font-size: 16px;
          cursor: pointer;
          opacity: 0.7;
        }
        
        .filter-chip-close:hover {
          opacity: 1;
        }
        
        .menu-header-item {
          --background: #4a5568;
          --color: white;
          --border-color: #5a6c7d;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .menu-header-item:hover {
          --background: #5a6c7d;
        }
        
        .menu-header-item.active {
          --background: #3498db;
          --color: white;
        }
        
        .menu-content-section {
          --background: #2d3748;
        }
        
        .menu-sub-item {
          --background: transparent;
          --color: #e2e8f0;
          --border-color: #4a5568;
          padding-left: 20px;
          transition: all 0.3s ease;
        }
        
        .menu-sub-item:hover {
          --background: rgba(255, 255, 255, 0.1);
        }
        
        .menu-sub-item.active {
          --background: rgba(52, 152, 219, 0.2);
          --color: #3498db;
        }
        
        /* Estilos para modo oscuro */
        @media (prefers-color-scheme: dark) {
          .menu-toolbar {
            --background: #1a1a1a;
            --color: #e0e0e0;
          }
          
          .clear-filters-button {
            --color: #ff6b6b;
            --background-hover: rgba(255, 107, 107, 0.1);
          }
          
          .menu-content {
            --background: #0d1117;
          }
          
          .active-filters {
            background: rgba(13, 17, 23, 0.9);
            border-bottom: 1px solid #30363d;
          }
          
          .active-filters-label {
            color: #c9d1d9;
          }
          
          .filter-chip {
            --background: rgba(88, 166, 255, 0.2);
            --color: #58a6ff;
          }
          
          .menu-header-item {
            --background: #21262d;
            --color: #f0f6fc;
            --border-color: #30363d;
          }
          
          .menu-header-item:hover {
            --background: #30363d;
          }
          
          .menu-header-item.active {
            --background: #58a6ff;
            --color: #010409;
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
          
          .menu-sub-item.active {
            --background: rgba(88, 166, 255, 0.2);
            --color: #58a6ff;
          }
        }
      `}</style>
    </>
  );
};