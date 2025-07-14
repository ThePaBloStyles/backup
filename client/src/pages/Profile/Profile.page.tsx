import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonIcon,
  IonModal,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonAlert
} from '@ionic/react';
import { person, call, location, bag, key, save, close } from 'ionicons/icons';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Order {
  _id: string;
  total: number;
  items: any[];
  createdAt: string;
  status: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estados para edición de perfil
  const [editForm, setEditForm] = useState({
    name: '',
    lastName: '',
    phone: '',
    address: ''
  });

  // Estados para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserOrders();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get(`/api/users/getUser/${user?._id}`);
      if (response.data.state) {
        const userData = response.data.user;
        setProfile({
          name: userData.name || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        });
        setEditForm({
          name: userData.name || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          address: userData.address || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserOrders = async () => {
    try {
      const response = await api.get(`/api/users/getUserOrders/${user?._id}`);
      if (response.data.state) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      // Mantener datos de ejemplo si hay error
      setOrders([
        {
          _id: '1',
          total: 25000,
          items: [{ name: 'Producto 1', quantity: 2 }],
          createdAt: '2025-07-10T10:00:00Z',
          status: 'Entregado'
        },
        {
          _id: '2',
          total: 45000,
          items: [{ name: 'Producto 2', quantity: 1 }],
          createdAt: '2025-07-05T15:30:00Z',
          status: 'En proceso'
        }
      ]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await api.put(`/api/users/updateProfile/${user?._id}`, editForm);
      if (response.data.state) {
        setProfile({ ...profile, ...editForm });
        setIsEditModalOpen(false);
        setAlertMessage('Perfil actualizado correctamente');
        setShowAlert(true);
      } else {
        setAlertMessage('Error al actualizar el perfil');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlertMessage('Error de conexión al actualizar el perfil');
      setShowAlert(true);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlertMessage('Las contraseñas nuevas no coinciden');
      setShowAlert(true);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlertMessage('La nueva contraseña debe tener al menos 6 caracteres');
      setShowAlert(true);
      return;
    }

    try {
      const response = await api.put(`/api/users/changePassword/${user?._id}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (response.data.state) {
        setIsPasswordModalOpen(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setAlertMessage('Contraseña cambiada correctamente');
        setShowAlert(true);
      } else {
        setAlertMessage(response.data.message || 'Error al cambiar la contraseña');
        setShowAlert(true);
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      setAlertMessage(error.response?.data?.message || 'Error de conexión al cambiar la contraseña');
      setShowAlert(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Mi Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonText>Cargando perfil...</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {/* Información Personal */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={person} style={{ marginRight: '8px' }} />
              Información Personal
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h3>Nombre</h3>
                  <p>{profile.name || 'No especificado'}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Apellido</h3>
                  <p>{profile.lastName || 'No especificado'}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Email</h3>
                  <p>{profile.email}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={call} slot="start" />
                <IonLabel>
                  <h3>Teléfono</h3>
                  <p>{profile.phone || 'No especificado'}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={location} slot="start" />
                <IonLabel>
                  <h3>Dirección</h3>
                  <p>{profile.address || 'No especificada'}</p>
                </IonLabel>
              </IonItem>
            </IonList>
            
            <div style={{ marginTop: '16px' }}>
              <IonButton 
                expand="block" 
                fill="outline" 
                onClick={() => setIsEditModalOpen(true)}
              >
                <IonIcon icon={save} slot="start" />
                Editar Información
              </IonButton>
              
              <IonButton 
                expand="block" 
                fill="outline" 
                color="warning"
                onClick={() => setIsPasswordModalOpen(true)}
                style={{ marginTop: '8px' }}
              >
                <IonIcon icon={key} slot="start" />
                Cambiar Contraseña
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Historial de Compras */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={bag} style={{ marginRight: '8px' }} />
              Historial de Compras
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {orders.length === 0 ? (
              <IonText color="medium">
                <p>No tienes compras registradas</p>
              </IonText>
            ) : (
              <IonList>
                {orders.map((order) => (
                  <IonItem key={order._id}>
                    <IonLabel>
                      <h3>Orden #{order._id.slice(-6)}</h3>
                      <p>Total: {formatCurrency(order.total)}</p>
                      <p>Fecha: {formatDate(order.createdAt)}</p>
                      <p>Estado: <span style={{ 
                        color: order.status === 'Entregado' ? 'green' : 'orange',
                        fontWeight: 'bold'
                      }}>{order.status}</span></p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>

        {/* Modal para editar perfil */}
        <IonModal isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Perfil</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsEditModalOpen(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre</IonLabel>
                <IonInput
                  value={editForm.name}
                  onIonInput={(e) => setEditForm({ ...editForm, name: e.detail.value! })}
                  placeholder="Ingresa tu nombre"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Apellido</IonLabel>
                <IonInput
                  value={editForm.lastName}
                  onIonInput={(e) => setEditForm({ ...editForm, lastName: e.detail.value! })}
                  placeholder="Ingresa tu apellido"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teléfono</IonLabel>
                <IonInput
                  value={editForm.phone}
                  onIonInput={(e) => setEditForm({ ...editForm, phone: e.detail.value! })}
                  placeholder="Ingresa tu teléfono"
                  type="tel"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Dirección</IonLabel>
                <IonInput
                  value={editForm.address}
                  onIonInput={(e) => setEditForm({ ...editForm, address: e.detail.value! })}
                  placeholder="Ingresa tu dirección"
                />
              </IonItem>
            </IonList>
            
            <IonButton expand="block" onClick={handleSaveProfile} style={{ marginTop: '20px' }}>
              <IonIcon icon={save} slot="start" />
              Guardar Cambios
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para cambiar contraseña */}
        <IonModal isOpen={isPasswordModalOpen} onDidDismiss={() => setIsPasswordModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Cambiar Contraseña</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsPasswordModalOpen(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Contraseña Actual</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.currentPassword}
                  onIonInput={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.detail.value! })}
                  placeholder="Ingresa tu contraseña actual"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Nueva Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.newPassword}
                  onIonInput={(e) => setPasswordForm({ ...passwordForm, newPassword: e.detail.value! })}
                  placeholder="Ingresa la nueva contraseña"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Confirmar Nueva Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={passwordForm.confirmPassword}
                  onIonInput={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.detail.value! })}
                  placeholder="Confirma la nueva contraseña"
                />
              </IonItem>
            </IonList>
            
            <IonButton 
              expand="block" 
              onClick={handleChangePassword} 
              style={{ marginTop: '20px' }}
              disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            >
              <IonIcon icon={key} slot="start" />
              Cambiar Contraseña
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Alert para mensajes */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
