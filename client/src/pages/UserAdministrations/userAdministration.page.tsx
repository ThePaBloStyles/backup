// 1. Importa IonButtons y IonBackButton
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonList, IonItem, IonLabel, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { trash } from 'ionicons/icons';

const UserAdministrationPage: React.FC = () => {
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
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Administrador de Usuarios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Administracion de Usuarios</h2>
        {/* Ocultamos depuración, solo mostramos usuarios detectados */}
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : errorMsg ? (
          <>
            <p style={{color:'red'}}>{errorMsg}</p>
            <pre style={{background:'#eee', padding:'10px', fontSize:'12px'}}>{JSON.stringify(rawResponse, null, 2)}</pre>
          </>
        ) : users.length === 0 ? (
          <>
            <p>No hay usuarios registrados.</p>
          </>
        ) : (
          <>
            <div style={{marginBottom:'20px', background:'#f9f9f9', padding:'10px', border:'1px solid #ccc'}}>
              <b>Usuarios detectados:</b>
              <ul>
                {users.map((user: any) => (
                  <li key={user._id}>
                    {user.name} ({user.email}) - {user.role}
                  </li>
                ))}
              </ul>
            </div>
            <IonButton color="primary" expand="block" style={{marginBottom:'20px'}} onClick={() => setShowSelector(true)}>
              Seleccionar usuario para administrar
            </IonButton>
            {showSelector && (
              <div style={{marginBottom:'20px'}}>
                <label htmlFor="userIdSelect"><b>Selecciona un usuario por ID:</b></label>
                <select id="userIdSelect" style={{marginLeft:'10px'}} value={selectedUserId} onChange={e => {
                  const selectedId = e.target.value;
                  setSelectedUserId(selectedId);
                  const user = users.find(u => u._id === selectedId);
                  setSelectedUser(user || null);
                }}>
                  <option value="">-- Selecciona --</option>
                  {users.map((user: any) => (
                    <option key={user._id} value={user._id}>
                      {user._id} - {user.name || user.email}
                    </option>
                  ))}
                </select>
                {selectedUser && (
                  <div style={{marginTop:'20px', background:'#eef', padding:'15px', border:'1px solid #99c'}}>
                    <h3>{selectedUser.name || selectedUser.email}</h3>
                    <p><b>Rol:</b> {selectedUser.role}</p>
                    <IonButton color="primary" style={{marginRight:'10px'}} onClick={() => history.push(`/admin/usuarios/${selectedUser._id}`)}>
                      Administrar esta persona
                    </IonButton>
                    <div style={{marginTop:'15px'}}>
                      <IonButton color="tertiary" style={{marginRight:'10px'}} onClick={async () => {
                        const newRole = selectedUser.role === 'usuario' ? 'administrador' : 'usuario';
                        if (window.confirm(`¿Seguro que quieres cambiar el rol a ${newRole}?`)) {
                          await handleEditSave(selectedUser._id, { role: newRole });
                          alert('Rol actualizado correctamente');
                        }
                      }}>
                        Cambiar rol a {selectedUser.role === 'usuario' ? 'administrador' : 'usuario'}
                      </IonButton>
                      <IonButton color="secondary" style={{marginRight:'10px'}} onClick={async () => {
                        const newName = prompt('Nuevo nombre:', selectedUser.name);
                        if (newName && window.confirm(`¿Seguro que quieres cambiar el nombre a "${newName}"?`)) {
                          await handleEditSave(selectedUser._id, { name: newName });
                          alert('Nombre actualizado correctamente');
                        }
                      }}>
                        Cambiar nombre
                      </IonButton>
                      <IonButton color="warning" onClick={async () => {
                        const newPass = prompt('Nueva contraseña:');
                        if (newPass && window.confirm('¿Seguro que quieres cambiar la contraseña?')) {
                          await handleEditSave(selectedUser._id, { password: newPass });
                          alert('Contraseña actualizada correctamente');
                        }
                      }}>
                        Cambiar contraseña
                      </IonButton>
                    </div>
                  </div>
                )}
              </div>
            )}
            <IonList>
              {users.map((user: any) => (
                <IonItem key={user.id || user._id}>
                  <IonLabel>
                    <b>{user.name || user.email}</b> <br />
                    <span>Rol: {user.role || user.rolle}</span>
                  </IonLabel>
                  <IonButton color="danger" slot="end" onClick={() => handleDelete(user.id || user._id)}>
                    <IonIcon icon={trash} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
        <IonButton color="danger" expand="block" onClick={handleLogout} style={{marginTop: 20}}>
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default UserAdministrationPage;