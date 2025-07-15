import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Register.styles.css';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    // Validar campos vacíos
    if (!name || !lastName || !email || !password || !phoneNumber) {
      alert('Por favor, rellene todos los campos.');
      return;
    }

    // Validar formato del número de teléfono (debe tener 8 dígitos después del +56)
    if (phoneNumber.length !== 8 || !/^\d{8}$/.test(phoneNumber)) {
      alert('Por favor, ingrese un número de teléfono válido (8 dígitos).');
      return;
    }

    try {
      const userData = { 
        name, 
        lastName, 
        email, 
        password, 
        phoneNumber: `+56${phoneNumber}`,
        role: 'usuario' 
      };
      const response = await fetch('/api/users/newUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
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
    <IonPage className="register-page">
      <IonContent className="register-content">
        <div className="register-container">
          <IonCard className="register-card">
            <IonCardHeader>
              <IonCardTitle>Crear cuenta</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={e => e.preventDefault()}>
                <IonItem className="register-item">
                  <IonLabel position="floating">Nombre</IonLabel>
                  <IonInput value={name} onIonChange={e => setName(e.detail.value!)} required />
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel position="floating">Apellido</IonLabel>
                  <IonInput value={lastName} onIonChange={e => setLastName(e.detail.value!)} required />
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel position="floating">Correo</IonLabel>
                  <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required />
                </IonItem>
                <IonItem className="register-item phone-item">
                  <IonLabel position="floating">Número de teléfono</IonLabel>
                  <div className="phone-input-container">
                    <span className="phone-prefix">+56</span>
                    <IonInput 
                      type="tel" 
                      value={phoneNumber} 
                      onIonChange={e => {
                        const value = e.detail.value!;
                        // Solo permitir números y máximo 8 dígitos
                        if (/^\d{0,8}$/.test(value)) {
                          setPhoneNumber(value);
                        }
                      }} 
                      placeholder="12345678"
                      maxlength={8}
                      required 
                    />
                  </div>
                </IonItem>
                <IonItem className="register-item">
                  <IonLabel position="floating">Contraseña</IonLabel>
                  <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required />
                </IonItem>
                <IonButton
                  expand="block"
                  className="register-button"
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    handleRegister();
                  }}
                >
                  Crear cuenta
                </IonButton>
                <IonButton
                  expand="block"
                  className="back-to-login-button"
                  routerLink="/login"
                  type="button"
                  fill="clear"
                >
                  Volver al login
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
