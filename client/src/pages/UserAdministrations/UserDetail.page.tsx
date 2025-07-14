import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:7000/api/users/getUser/${id}`);
        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          setError('Usuario no encontrado.');
        }
      } catch (err: any) {
        setError('Error al cargar usuario.');
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/usuarios" />
          </IonButtons>
          <IonTitle>Detalle de Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <p>Cargando usuario...</p>
        ) : error ? (
          <p style={{color:'red'}}>{error}</p>
        ) : user ? (
          <div style={{background:'#f9f9f9', padding:'20px', border:'1px solid #ccc'}}>
            <h2>{user.name || user.email}</h2>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Rol:</b> {user.role}</p>
            <IonButton color="medium" onClick={() => history.goBack()}>Volver</IonButton>
          </div>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default UserDetailPage;
