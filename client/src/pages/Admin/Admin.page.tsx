import { IonPage, IonContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { people, storefront, home, star, diamond, trophy, flash } from 'ionicons/icons';
import './Admin.styles.css';

const AdminPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();

  return (
    <IonPage>
      <IonContent>
        {/* Header de bienvenida */}
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <IonIcon icon={star} style={{ color: '#ffeaa7', fontSize: '24px' }} />
            <h1 className="admin-title">Panel de Administración</h1>
            <IonIcon icon={star} style={{ color: '#ffeaa7', fontSize: '24px' }} />
          </div>
          <p className="admin-subtitle">
            <IonIcon icon={diamond} style={{ marginRight: '8px' }} />
            Gestiona tu sistema de manera eficiente
          </p>
        </div>

        {/* Información del usuario */}
        <div className="admin-user-info">
          <div className="admin-user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="admin-user-details">
            <h2>{user?.name || user?.email || 'Usuario'}</h2>
            <IonChip color="primary" className="admin-role-chip">
              <IonIcon icon={trophy} />
              {user?.role === 'bodeguero' ? 'Bodeguero' : user?.role === 'administrador' ? 'Administrador' : 'Usuario'}
            </IonChip>
          </div>
        </div>

        {/* Navegación principal */}
        <div className="admin-navigation">
          <IonButton
            expand="block"
            size="large"
            color="success"
            routerLink="/home"
            className="admin-nav-button home"
          >
            <IonIcon icon={home} slot="start" />
            Ir al Home
          </IonButton>
        </div>

        {/* Tarjetas de administración */}
        <div className="admin-content">
          <IonGrid>
            <IonRow>
              {/* Administrar usuarios - Solo para administradores */}
              {user?.role === 'administrador' && (
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <div className="admin-card users" onClick={() => history.push('/admUsuarios')}>
                    <div className="admin-card-icon">
                      <IonIcon icon={people} />
                    </div>
                    <h3>Administrar Usuarios</h3>
                    <p>Gestiona roles, permisos y usuarios del sistema</p>
                    <div className="admin-card-overlay">
                      <IonIcon icon={flash} className="admin-card-flash" />
                    </div>
                  </div>
                </IonCol>
              )}
              
              {/* Administrar bodega - Para bodegueros y administradores */}
              {(user?.role === 'bodeguero' || user?.role === 'administrador') && (
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <div className="admin-card warehouse" onClick={() => history.push('/bodega')}>
                    <div className="admin-card-icon">
                      <IonIcon icon={storefront} />
                    </div>
                    <h3>Administrar Bodega</h3>
                    <p>Controla inventario, productos y stock</p>
                    <div className="admin-card-overlay">
                      <IonIcon icon={flash} className="admin-card-flash" />
                    </div>
                  </div>
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        </div>

        {/* Información del sistema */}
        <div className="admin-system-info">
          <div className="admin-system-card">
            <h3>
              <IonIcon icon={diamond} style={{ marginRight: '8px' }} />
              Sistema de Administración
            </h3>
            <p>Versión 2.0 - Actualizada y optimizada</p>
            <div className="admin-system-status">
              <span className="admin-status-indicator"></span>
              Sistema operativo
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
