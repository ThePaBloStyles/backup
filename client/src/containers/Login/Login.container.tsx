import { IonCol, IonContent, IonGrid, IonItem, IonLabel, IonRow, IonInput, IonButton } from "@ionic/react"
import { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../utils/api";

export const LoginContainer = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Por favor, rellene todos los campos.');
            return;
        }
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const data = response.data;
            if (data.state) {
                // Guarda el token en localStorage
                if (data.token && data.token.token) {
                  localStorage.setItem('token', data.token.token);
                }
                // Verifica el rol del usuario
                const user = data.findUser || data.user;
                if (user && user.role === 'administrador') {
                    localStorage.setItem('userRole', 'administrador');
                    alert('Bienvenido SuperAdmin');
                    history.push('/admin');
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                } else {
                    localStorage.setItem('userRole', user?.role || 'usuario');
                    alert('Bienvenido usuario');
                    history.push('/home');
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            alert('Error de conexión o del servidor. Intente más tarde.');
        }
    }

    return (
        <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol>
                    </IonCol>
                    <IonCol sizeXl="3" sizeLg="4" sizeMd="6" sizeSm="10" sizeXs="12">
                        {/*LOGO*/}

                        <div style={{textAlign: 'center', marginBottom: '20px', marginTop: 100}}>
                            <img src='./images/simotec.webp'></img>
                        </div>

                        {/* Formulario */}

                        <IonItem>
                            <IonLabel position = 'floating'>Correo</IonLabel>
                            <IonInput
                                type="email"
                                value={email}
                                onIonChange={e => setEmail(e.detail.value!)}
                                required
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Contraseña</IonLabel>
                            <IonInput
                                type="password"
                                value={password}
                                onIonChange={e => setPassword(e.detail.value!)}
                                required
                            />
                        </IonItem>

                                <IonButton expand="block" className="ion-margin-top" onClick={handleLogin}>
                                  Iniciar sesión
                                </IonButton>
                                <IonButton expand="block" color="secondary" className="ion-margin-top" routerLink="/register">
                                  Regístrate
                                </IonButton>
                                <IonButton expand="block" color="medium" className="ion-margin-top" routerLink="/home">
                                  Ir al Home
                                </IonButton>

                    </IonCol>
                    <IonCol>
                        
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}