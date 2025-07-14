import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonSpinner } from '@ionic/react';
import { useAuth } from '../../hooks/useAuth';

export const AuthTestPage: React.FC = () => {
  const { isAuthenticated, user, loading, authMessage, logout, checkAuth } = useAuth();

  const clearTokenAndTest = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.reload();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Test de Autenticación</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Estado de Autenticación</h2>
            <p><strong>Loading:</strong> {loading ? 'SÍ' : 'NO'}</p>
            <p><strong>Autenticado:</strong> {isAuthenticated ? 'SÍ' : 'NO'}</p>
            <p><strong>Usuario:</strong> {user ? `${user.name} (${user.email})` : 'No hay usuario'}</p>
            <p><strong>Mensaje:</strong> {authMessage || 'Sin mensaje'}</p>
            
            {loading && (
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <IonSpinner name="crescent" />
                <p>Cargando...</p>
              </div>
            )}
            
            <div style={{ marginTop: '20px' }}>
              <IonButton expand="block" onClick={clearTokenAndTest} color="warning">
                Limpiar Token y Recargar
              </IonButton>
              
              <IonButton expand="block" onClick={checkAuth} color="secondary">
                Verificar Auth Manualmente
              </IonButton>
              
              {isAuthenticated && (
                <IonButton expand="block" onClick={logout} color="danger">
                  Cerrar Sesión
                </IonButton>
              )}
              
              <IonButton expand="block" routerLink="/login" color="primary">
                Ir a Login
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
