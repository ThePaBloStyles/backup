import { IonPage, IonContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonChip, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { trash, people, home, star, diamond, trophy, flash, settings, person, checkmark, close } from 'ionicons/icons';
import './UserAdmin.styles.css';

const UserAdministrationPage: React.FC = () => {
  const { user } = useAuth();
  // Estado para selector y usuario seleccionado
  const [showSelector, setShowSelector] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const history = useHistory();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<any>({});
  const handleEdit = (user: any) => {
    setEditUserId(user._id);
    setEditUserData({ name: user.name || '', email: user.email || '', role: user.role });
  };

  const handleEditChange = (field: string, value: string) => {
    setEditUserData({ ...editUserData, [field]: value });
  };

  const handleEditSave = async (id: string, customData?: any) => {
    try {
      const bodyData = customData ? customData : editUserData;
      const res = await fetch(`/api/users/updateUser/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      if (data.state) {
        setUsers(users.map((u: any) => (u._id === id ? { ...u, ...bodyData } : u)));
        setEditUserId(null);
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser({ ...selectedUser, ...bodyData });
        }
      } else {
        alert('No se pudo actualizar el usuario');
      }
    } catch (err) {
      alert('Error al actualizar usuario');
    }
  };

  const handleEditCancel = () => {
    setEditUserId(null);
    setEditUserData({});
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const [rawResponse, setRawResponse] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.get('http://localhost:7000/api/users/getAllUsers');
      console.log('Respuesta usuarios:', res.data);
      setRawResponse(res.data);
      if (res.data.state && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
        setErrorMsg('La respuesta no contiene usuarios válidos.');
      }
    } catch (err: any) {
      setUsers([]);
      setRawResponse(err?.response?.data || err);
      setErrorMsg('Error al consultar usuarios: ' + (err?.message || 'Error desconocido'));
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      const res = await fetch(`/api/users/deleteUser/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.state) {
        setUsers(users.filter((u: any) => u._id !== id));
      } else {
        alert('No se pudo eliminar el usuario');
      }
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Bloque de depuración: mostrar el array users como texto plano
  return (
    <IonPage>
      <IonContent>
        {/* Header de bienvenida */}
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <IonIcon icon={star} style={{ color: '#ffeaa7', fontSize: '24px' }} />
            <h1 className="admin-title">Administración de Usuarios</h1>
            <IonIcon icon={star} style={{ color: '#ffeaa7', fontSize: '24px' }} />
          </div>
          <p className="admin-subtitle">
            <IonIcon icon={people} style={{ marginRight: '8px' }} />
            Gestiona roles, permisos y usuarios del sistema
          </p>
        </div>

        {/* Información del usuario actual */}
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
            routerLink="/admin"
            className="admin-nav-button home"
          >
            <IonIcon icon={home} slot="start" />
            Volver al Panel
          </IonButton>
        </div>

        {/* Contenido principal */}
        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">
              <IonIcon icon={settings} className="admin-loading-icon" />
              <p>Cargando usuarios...</p>
            </div>
          ) : errorMsg ? (
            <div className="admin-error">
              <IonIcon icon={close} />
              <p>{errorMsg}</p>
              <pre className="admin-debug">{JSON.stringify(rawResponse, null, 2)}</pre>
            </div>
          ) : users.length === 0 ? (
            <div className="admin-empty">
              <IonIcon icon={person} />
              <p>No hay usuarios registrados.</p>
            </div>
          ) : (
            <IonGrid>
              <IonRow>
                {/* Selector de usuario */}
                <IonCol size="12">
                  <div className="admin-card selector">
                    <div className="admin-card-icon">
                      <IonIcon icon={people} />
                    </div>
                    <h3>Seleccionar Usuario</h3>
                    <p>Elige un usuario para administrar</p>
                    
                    {!showSelector ? (
                      <IonButton 
                        color="primary" 
                        expand="block" 
                        onClick={() => setShowSelector(true)}
                        className="admin-selector-button"
                      >
                        <IonIcon icon={settings} slot="start" />
                        Administrar Usuario
                      </IonButton>
                    ) : (
                      <div className="admin-selector-content">
                        <select 
                          className="admin-user-select"
                          value={selectedUserId} 
                          onChange={e => {
                            const selectedId = e.target.value;
                            setSelectedUserId(selectedId);
                            const user = users.find(u => u._id === selectedId);
                            setSelectedUser(user || null);
                          }}
                        >
                          <option value="">-- Selecciona un usuario --</option>
                          {users.map((user: any) => (
                            <option key={user._id} value={user._id}>
                              {user.name || user.email} - {user.role}
                            </option>
                          ))}
                        </select>
                        
                        {selectedUser && (
                          <div className="admin-selected-user">
                            <div className="admin-selected-user-header">
                              <div className="admin-selected-user-avatar">
                                {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : selectedUser.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="admin-selected-user-info">
                                <h4>{selectedUser.name || selectedUser.email}</h4>
                                <IonChip color="secondary" className="admin-user-role-chip">
                                  <IonIcon icon={diamond} />
                                  {selectedUser.role}
                                </IonChip>
                              </div>
                            </div>
                            
                            <div className="admin-user-actions">
                              <IonButton 
                                color="primary" 
                                fill="outline"
                                onClick={() => history.push(`/admin/usuarios/${selectedUser._id}`)}
                              >
                                <IonIcon icon={person} slot="start" />
                                Ver Detalles
                              </IonButton>
                              
                              <div className="admin-role-selector">
                                <label>Cambiar Rol:</label>
                                <IonSelect 
                                  value={selectedUser.role} 
                                  placeholder="Seleccionar rol"
                                  className="admin-role-select"
                                  onIonChange={async (e) => {
                                    const newRole = e.detail.value;
                                    if (newRole !== selectedUser.role && window.confirm(`¿Seguro que quieres cambiar el rol a ${newRole}?`)) {
                                      await handleEditSave(selectedUser._id, { role: newRole });
                                      alert('Rol actualizado correctamente');
                                    }
                                  }}
                                >
                                  <IonSelectOption value="usuario">Usuario</IonSelectOption>
                                  <IonSelectOption value="bodeguero">Bodeguero</IonSelectOption>
                                  <IonSelectOption value="administrador">Administrador</IonSelectOption>
                                </IonSelect>
                              </div>
                              
                              <div className="admin-quick-actions">
                                <IonButton 
                                  color="secondary" 
                                  size="small"
                                  onClick={async () => {
                                    const newName = prompt('Nuevo nombre:', selectedUser.name);
                                    if (newName && window.confirm(`¿Seguro que quieres cambiar el nombre a "${newName}"?`)) {
                                      await handleEditSave(selectedUser._id, { name: newName });
                                      alert('Nombre actualizado correctamente');
                                    }
                                  }}
                                >
                                  Cambiar Nombre
                                </IonButton>
                                
                                <IonButton 
                                  color="warning" 
                                  size="small"
                                  onClick={async () => {
                                    const newPass = prompt('Nueva contraseña:');
                                    if (newPass && window.confirm('¿Seguro que quieres cambiar la contraseña?')) {
                                      await handleEditSave(selectedUser._id, { password: newPass });
                                      alert('Contraseña actualizada correctamente');
                                    }
                                  }}
                                >
                                  Cambiar Contraseña
                                </IonButton>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </IonCol>
                
                {/* Lista de usuarios */}
                <IonCol size="12">
                  <div className="admin-card users-list">
                    <div className="admin-card-icon">
                      <IonIcon icon={people} />
                    </div>
                    <h3>Lista de Usuarios</h3>
                    <p>Todos los usuarios registrados en el sistema</p>
                    
                    <div className="admin-users-count">
                      <IonChip color="success">
                        <IonIcon icon={checkmark} />
                        {users.length} usuarios registrados
                      </IonChip>
                    </div>
                    
                    <IonList className="admin-users-list">
                      {users.map((user: any) => (
                        <IonItem key={user.id || user._id} className="admin-user-item">
                          <div className="admin-user-item-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </div>
                          <IonLabel>
                            <div className="admin-user-item-info">
                              <h4>{user.name || user.email}</h4>
                              <IonChip color="medium" className="admin-user-item-role">
                                {user.role || user.rolle}
                              </IonChip>
                            </div>
                          </IonLabel>
                          <IonButton 
                            color="danger" 
                            fill="clear"
                            slot="end" 
                            onClick={() => handleDelete(user.id || user._id)}
                            className="admin-delete-button"
                          >
                            <IonIcon icon={trash} />
                          </IonButton>
                        </IonItem>
                      ))}
                    </IonList>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </div>

        {/* Información del sistema */}
        <div className="admin-system-info">
          <div className="admin-system-card">
            <h3>
              <IonIcon icon={diamond} style={{ marginRight: '8px' }} />
              Sistema de Administración de Usuarios
            </h3>
            <p>Versión 2.0 - Gestión avanzada de usuarios</p>
            <div className="admin-system-status">
              <span className="admin-status-indicator"></span>
              {users.length} usuarios activos
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserAdministrationPage;