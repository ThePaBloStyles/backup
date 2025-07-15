import { IonPage, IonContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonChip, IonGrid, IonRow, IonCol, IonModal, IonHeader, IonToolbar, IonTitle, IonTextarea, IonProgressBar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { trash, people, home, star, diamond, trophy, flash, settings, person, checkmark, close, add, cloudUpload, checkboxOutline, checkbox, personAdd, swapHorizontal } from 'ionicons/icons';
import './UserAdmin.styles.css';

const UserAdministrationPage: React.FC = () => {
  const { user } = useAuth();
  // Estado para selector y usuario seleccionado
  const [showSelector, setShowSelector] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Estados para selección múltiple
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  
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
  
  // Estados para creación masiva
  const [showMassiveModal, setShowMassiveModal] = useState(false);
  const [massiveUsersText, setMassiveUsersText] = useState('');
  const [massiveProgress, setMassiveProgress] = useState(0);
  const [massiveLoading, setMassiveLoading] = useState(false);
  const [massiveResults, setMassiveResults] = useState<any[]>([]);

  // Template de usuarios para ejemplo
  const exampleUsers = `[
  {
    "name": "Carlos",
    "lastName": "Martínez",
    "email": "carlos.martinez@bodega.com",
    "password": "bodega123",
    "phoneNumber": "+56912345678",
    "role": "bodeguero"
  },
  {
    "name": "Ana",
    "lastName": "González",
    "email": "ana.gonzalez@bodega.com",
    "password": "bodega123",
    "phoneNumber": "+56912345679",
    "role": "bodeguero"
  },
  {
    "name": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@usuario.com",
    "password": "user123",
    "phoneNumber": "+56123456789",
    "role": "usuario"
  }
]`;

  const handleMassiveCreate = async () => {
    if (!massiveUsersText.trim()) {
      alert('Por favor, ingresa la lista de usuarios en formato JSON');
      return;
    }

    try {
      const usersArray = JSON.parse(massiveUsersText);
      
      if (!Array.isArray(usersArray)) {
        alert('El formato debe ser un array de usuarios');
        return;
      }

      setMassiveLoading(true);
      setMassiveResults([]);
      setMassiveProgress(0);

      const results = [];
      const total = usersArray.length;

      for (let i = 0; i < usersArray.length; i++) {
        const userData = usersArray[i];
        
        try {
          const response = await fetch('/api/users/newUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          
          const data = await response.json();
          
          if (data.state) {
            results.push({
              index: i + 1,
              name: userData.name,
              email: userData.email,
              status: 'success',
              message: 'Usuario creado exitosamente'
            });
          } else {
            results.push({
              index: i + 1,
              name: userData.name,
              email: userData.email,
              status: 'error',
              message: data.message || 'Error al crear usuario'
            });
          }
        } catch (error) {
          results.push({
            index: i + 1,
            name: userData.name,
            email: userData.email,
            status: 'error',
            message: 'Error de conexión'
          });
        }

        setMassiveProgress((i + 1) / total);
        setMassiveResults([...results]);
      }

      setMassiveLoading(false);
      
      // Refrescar la lista de usuarios
      fetchUsers();
      
      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;
      
      alert(`Proceso completado: ${successCount} usuarios creados, ${errorCount} errores`);
      
    } catch (error) {
      setMassiveLoading(false);
      alert('Error al procesar el JSON. Verifica el formato.');
    }
  };
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
        // Actualizar selección múltiple
        setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(null);
        }
      } else {
        alert('No se pudo eliminar el usuario');
      }
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  // Funciones para selección múltiple
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const selectAllUsers = () => {
    setSelectedUsers(users.map(user => user._id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const handleMultipleDelete = async () => {
    if (selectedUsers.length === 0) {
      alert('No hay usuarios seleccionados');
      return;
    }

    if (!window.confirm(`¿Seguro que deseas eliminar ${selectedUsers.length} usuarios?`)) return;

    let successCount = 0;
    let errorCount = 0;

    for (const userId of selectedUsers) {
      try {
        const res = await fetch(`/api/users/deleteUser/${userId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.state) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
      }
    }

    // Refrescar lista
    fetchUsers();
    setSelectedUsers([]);
    
    alert(`Eliminación completada: ${successCount} usuarios eliminados, ${errorCount} errores`);
  };

  const handleMultipleRoleChange = async (newRole: string) => {
    if (selectedUsers.length === 0) {
      alert('No hay usuarios seleccionados');
      return;
    }

    if (!window.confirm(`¿Seguro que deseas cambiar el rol de ${selectedUsers.length} usuarios a ${newRole}?`)) return;

    let successCount = 0;
    let errorCount = 0;

    for (const userId of selectedUsers) {
      try {
        const res = await fetch(`/api/users/updateUser/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        });
        const data = await res.json();
        if (data.state) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
      }
    }

    // Refrescar lista
    fetchUsers();
    setSelectedUsers([]);
    
    alert(`Cambio de rol completado: ${successCount} usuarios actualizados, ${errorCount} errores`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Bloque de depuración: mostrar el array users como texto plano
  return (
    <IonPage className="admin-page">
      <IonContent className="admin-content">
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
          
          <IonButton
            expand="block"
            size="large"
            color="secondary"
            onClick={() => setShowMassiveModal(true)}
            className="admin-nav-button massive"
          >
            <IonIcon icon={cloudUpload} slot="start" />
            Crear Usuarios Masivamente
          </IonButton>

          <IonButton
            expand="block"
            size="large"
            color={multiSelectMode ? "warning" : "tertiary"}
            onClick={() => {
              setMultiSelectMode(!multiSelectMode);
              setSelectedUsers([]);
            }}
            className="admin-nav-button multiselect"
          >
            <IonIcon icon={multiSelectMode ? checkboxOutline : personAdd} slot="start" />
            {multiSelectMode ? 'Salir de Selección' : 'Selección Múltiple'}
          </IonButton>
        </div>

        {/* Panel de selección múltiple */}
        {multiSelectMode && (
          <div className="admin-multi-select-panel">
            <div className="admin-multi-select-header">
              <h3>
                <IonIcon icon={checkboxOutline} style={{ marginRight: '8px' }} />
                Selección Múltiple
              </h3>
              <IonChip color="primary">
                {selectedUsers.length} usuarios seleccionados
              </IonChip>
            </div>
            
            <div className="admin-multi-select-actions">
              <IonButton 
                size="small" 
                fill="outline" 
                onClick={selectAllUsers}
                disabled={selectedUsers.length === users.length}
              >
                <IonIcon icon={checkmark} slot="start" />
                Seleccionar Todo
              </IonButton>
              
              <IonButton 
                size="small" 
                fill="outline" 
                onClick={clearSelection}
                disabled={selectedUsers.length === 0}
              >
                <IonIcon icon={close} slot="start" />
                Limpiar
              </IonButton>
              
              {selectedUsers.length > 0 && (
                <>
                  <IonButton 
                    size="small" 
                    color="danger" 
                    onClick={handleMultipleDelete}
                  >
                    <IonIcon icon={trash} slot="start" />
                    Eliminar ({selectedUsers.length})
                  </IonButton>
                  
                  <div className="admin-multi-role-actions">
                    <span>Cambiar rol a:</span>
                    <IonButton 
                      size="small" 
                      color="secondary" 
                      onClick={() => handleMultipleRoleChange('usuario')}
                    >
                      Usuario
                    </IonButton>
                    <IonButton 
                      size="small" 
                      color="secondary" 
                      onClick={() => handleMultipleRoleChange('bodeguero')}
                    >
                      Bodeguero
                    </IonButton>
                    <IonButton 
                      size="small" 
                      color="secondary" 
                      onClick={() => handleMultipleRoleChange('administrador')}
                    >
                      Admin
                    </IonButton>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
                          {multiSelectMode && (
                            <IonButton
                              slot="start"
                              fill="clear"
                              color={selectedUsers.includes(user._id) ? "primary" : "medium"}
                              onClick={() => toggleUserSelection(user._id)}
                              className="admin-checkbox-button"
                            >
                              <IonIcon icon={selectedUsers.includes(user._id) ? checkbox : checkboxOutline} />
                            </IonButton>
                          )}
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
                          {!multiSelectMode && (
                            <IonButton 
                              color="danger" 
                              fill="clear"
                              slot="end" 
                              onClick={() => handleDelete(user.id || user._id)}
                              className="admin-delete-button"
                            >
                              <IonIcon icon={trash} />
                            </IonButton>
                          )}
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

        {/* Modal para creación masiva */}
        <IonModal isOpen={showMassiveModal} onDidDismiss={() => setShowMassiveModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Crear Usuarios Masivamente</IonTitle>
              <IonButton 
                slot="end" 
                fill="clear" 
                onClick={() => setShowMassiveModal(false)}
              >
                <IonIcon icon={close} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="massive-modal-content">
            <div style={{ padding: '20px' }}>
              <h3>Formato JSON requerido:</h3>
              <p>Pega aquí un array de usuarios en formato JSON:</p>
              
              <IonButton 
                fill="outline" 
                size="small" 
                onClick={() => setMassiveUsersText(exampleUsers)}
                style={{ marginBottom: '10px' }}
              >
                <IonIcon icon={add} slot="start" />
                Cargar Ejemplo
              </IonButton>
              
              <textarea
                value={massiveUsersText}
                onChange={e => setMassiveUsersText(e.target.value)}
                placeholder="Pega aquí el JSON con los usuarios..."
                rows={15}
                style={{ 
                  width: '100%',
                  border: '1px solid #ccc', 
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  padding: '10px',
                  resize: 'vertical',
                  backgroundColor: '#fff',
                  color: '#000000'
                }}
              />
              
              {massiveLoading && (
                <div style={{ marginTop: '20px' }}>
                  <p>Creando usuarios... {Math.round(massiveProgress * 100)}%</p>
                  <IonProgressBar value={massiveProgress} />
                </div>
              )}
              
              {massiveResults.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Resultados:</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {massiveResults.map((result, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          padding: '10px',
                          margin: '5px 0',
                          backgroundColor: result.status === 'success' ? '#d4edda' : '#f8d7da',
                          borderRadius: '5px',
                          fontSize: '14px'
                        }}
                      >
                        <strong>{result.index}. {result.name} ({result.email})</strong>
                        <br />
                        <span style={{ color: result.status === 'success' ? '#155724' : '#721c24' }}>
                          {result.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <IonButton 
                  expand="block" 
                  color="primary"
                  onClick={handleMassiveCreate}
                  disabled={massiveLoading}
                >
                  <IonIcon icon={cloudUpload} slot="start" />
                  {massiveLoading ? 'Creando...' : 'Crear Usuarios'}
                </IonButton>
                
                <IonButton 
                  expand="block" 
                  color="medium"
                  fill="outline"
                  onClick={() => {
                    setMassiveUsersText('');
                    setMassiveResults([]);
                    setMassiveProgress(0);
                  }}
                  disabled={massiveLoading}
                >
                  Limpiar
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default UserAdministrationPage;