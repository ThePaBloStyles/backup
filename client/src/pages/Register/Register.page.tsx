import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    // Validar campos vacíos
    if (!name || !lastName || !email || !password) {
      alert('Por favor, rellene todos los campos.');
      return;
    }
    try {
      const userData = { name, lastName, email, password, role: 'usuario' };
      const response = await fetch('/api/users/newUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData })
      });
      const data = await response.json();
      if (data.state) {
        alert('Usuario creado con éxito. Ahora puede iniciar sesión.');
        history.push('/login');
      } else {
        alert('No se pudo registrar el usuario. Intente con otro correo o revise los datos.');
      }
    } catch (error) {
      alert('Error de conexión o del servidor. Intente más tarde.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registro de Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form style={{ maxWidth: 400, margin: '40px auto' }} onSubmit={e => e.preventDefault()}>
          <IonItem>
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput value={name} onIonChange={e => setName(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Apellido</IonLabel>
            <IonInput value={lastName} onIonChange={e => setLastName(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Correo</IonLabel>
            <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required />
          </IonItem>
          <IonButton
            expand="block"
            className="ion-margin-top"
            type="button"
            onClick={e => {
              e.preventDefault();
              handleRegister();
            }}
          >
            Registrarse
          </IonButton>
          <IonButton
            expand="block"
            color="secondary"
            className="ion-margin-top"
            routerLink="/login"
            type="button"
          >
            Volver al login
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
