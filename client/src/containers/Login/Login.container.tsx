import { 
    IonCol, IonContent, IonGrid, IonItem, IonLabel, IonRow, IonInput, IonButton, 
    IonCard, IonCardContent, IonIcon, IonText, IonToast
} from "@ionic/react"
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { mail, lockClosed, person, eye, eyeOff } from 'ionicons/icons';
import api from "../../utils/api";

export const LoginContainer = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState<'success' | 'danger' | 'warning'>('success');
    const history = useHistory();

    const showMessage = (message: string, color: 'success' | 'danger' | 'warning' = 'danger') => {
        setToastMessage(message);
        setToastColor(color);
        setShowToast(true);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showMessage('Por favor, rellene todos los campos.', 'warning');
            return;
        }
        
        setIsLoading(true);
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
                if (user && (user.role === 'administrador' || user.role === 'bodeguero')) {
                    localStorage.setItem('userRole', user.role);
                    if (user.role === 'administrador') {
                        showMessage('¡Bienvenido SuperAdmin!', 'success');
                    } else if (user.role === 'bodeguero') {
                        showMessage('¡Bienvenido Bodeguero!', 'success');
                    }
                    setTimeout(() => {
                        history.push('/admin');
                        window.location.reload();
                    }, 1000);
                } else {
                    localStorage.setItem('userRole', user?.role || 'usuario');
                    showMessage('¡Bienvenido!', 'success');
                    setTimeout(() => {
                        history.push('/home');
                        window.location.reload();
                    }, 1000);
                }
            } else {
                showMessage('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            showMessage('Error de conexión. Intente más tarde.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <IonContent className="login-content">
            <div className="login-background">
                <IonGrid className="login-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center min-height-100">
                        <IonCol sizeXl="4" sizeLg="5" sizeMd="6" sizeSm="8" sizeXs="11">
                            <IonCard className="login-card">
                                <IonCardContent className="login-card-content">
                                    {/* Logo y título */}
                                    <div className="login-header">
                                        <div className="logo-container">
                                            <img 
                                                src='./images/images.png' 
                                                alt="Ferramax Logo"
                                                className="login-logo"
                                            />
                                        </div>
                                        <IonText className="login-title">
                                            <h1>¡Bienvenido!</h1>
                                        </IonText>
                                        <IonText className="login-subtitle">
                                            <p>Inicia sesión en tu cuenta</p>
                                        </IonText>
                                    </div>

                                    {/* Formulario */}
                                    <div className="login-form">
                                        <IonItem className="login-item" lines="none">
                                            <IonIcon icon={mail} slot="start" className="input-icon" />
                                            <IonLabel position="stacked">Correo electrónico</IonLabel>
                                            <IonInput
                                                type="email"
                                                value={email}
                                                onIonChange={e => setEmail(e.detail.value!)}
                                                placeholder="tu@email.com"
                                                className="custom-input"
                                                required
                                            />
                                        </IonItem>

                                        <IonItem className="login-item" lines="none">
                                            <IonIcon icon={lockClosed} slot="start" className="input-icon" />
                                            <IonLabel position="stacked">Contraseña</IonLabel>
                                            <IonInput
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onIonChange={e => setPassword(e.detail.value!)}
                                                placeholder="••••••••"
                                                className="custom-input"
                                                required
                                            />
                                            <IonIcon 
                                                icon={showPassword ? eyeOff : eye} 
                                                slot="end" 
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        </IonItem>

                                        <IonButton 
                                            expand="block" 
                                            className="login-button" 
                                            onClick={handleLogin}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
                                        </IonButton>

                                        <div className="login-divider">
                                            <span>o</span>
                                        </div>

                                        <IonButton 
                                            expand="block" 
                                            fill="outline" 
                                            className="register-button" 
                                            routerLink="/register"
                                        >
                                            <IonIcon icon={person} slot="start" />
                                            CREAR CUENTA NUEVA
                                        </IonButton>

                                        <IonButton 
                                            expand="block" 
                                            fill="clear" 
                                            className="home-button" 
                                            routerLink="/home"
                                            size="small"
                                        >
                                            CONTINUAR SIN CUENTA
                                        </IonButton>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                color={toastColor}
                position="top"
            />

            <style>{`
                .login-content {
                    --background: linear-gradient(135deg, #6c7b7f 0%, #4a4a4a 50%, #2c3e50 100%);
                }
                
                .login-background {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #6c7b7f 0%, #4a4a4a 50%, #2c3e50 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                /* Soporte para modo oscuro */
                @media (prefers-color-scheme: dark) {
                    .login-content {
                        --background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%);
                    }
                    
                    .login-background {
                        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%);
                    }
                }
                
                .login-grid {
                    height: 100%;
                }
                
                .min-height-100 {
                    min-height: 100vh;
                }
                
                .login-card {
                    margin: 0;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                    border-radius: 20px;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .login-card-content {
                    padding: 40px 30px;
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.98) 100%);
                }
                
                /* Card content en modo oscuro */
                @media (prefers-color-scheme: dark) {
                    .login-card-content {
                        background: linear-gradient(145deg, rgba(45, 45, 45, 0.95) 0%, rgba(35, 35, 35, 0.98) 100%);
                    }
                }
                
                .login-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .logo-container {
                    margin-bottom: 20px;
                }
                
                .login-logo {
                    max-width: 120px;
                    height: auto;
                    filter: drop-shadow(0 4px 8px rgba(74, 74, 74, 0.3));
                }
                
                .login-title h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 8px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
                
                .login-subtitle p {
                    margin: 0;
                    color: #5a6c7d;
                    font-size: 16px;
                    font-weight: 400;
                }
                
                /* Títulos en modo oscuro */
                @media (prefers-color-scheme: dark) {
                    .login-title h1 {
                        color: #e0e0e0;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                    }
                    
                    .login-subtitle p {
                        color: #b0b0b0;
                    }
                }
                
                .login-form {
                    margin-top: 30px;
                }
                
                .login-item {
                    margin-bottom: 20px;
                    --background: #f8f9fa;
                    --border-radius: 12px;
                    --padding-start: 16px;
                    --padding-end: 16px;
                    --inner-padding-end: 16px;
                    border: 2px solid #e1e8ed;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(74, 74, 74, 0.1);
                }
                
                .login-item:focus-within {
                    border-color: #4a4a4a;
                    box-shadow: 0 0 0 3px rgba(74, 74, 74, 0.15);
                    background: #ffffff;
                }
                
                /* Items en modo oscuro */
                @media (prefers-color-scheme: dark) {
                    .login-item {
                        --background: #2d2d2d;
                        border-color: #404040;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    }
                    
                    .login-item:focus-within {
                        border-color: #666666;
                        box-shadow: 0 0 0 3px rgba(102, 102, 102, 0.2);
                        --background: #1a1a1a;
                    }
                }
                
                .input-icon {
                    color: #4a4a4a;
                    margin-right: 12px;
                }
                
                .password-toggle {
                    color: #6c7b7f;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }
                
                .password-toggle:hover {
                    color: #4a4a4a;
                }
                
                .custom-input {
                    --padding-start: 0;
                    --color: #2c3e50;
                }
                
                /* Iconos e inputs en modo oscuro */
                @media (prefers-color-scheme: dark) {
                    .input-icon {
                        color: #b0b0b0;
                    }
                    
                    .password-toggle {
                        color: #888888;
                    }
                    
                    .password-toggle:hover {
                        color: #b0b0b0;
                    }
                    
                    .custom-input {
                        --color: #e0e0e0;
                    }
                }
                
                .login-button {
                    margin-top: 30px;
                    --background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    --background-activated: linear-gradient(135deg, #1a252f 0%, #2c3e50 100%);
                    --color: #ffffff !important;
                    --border-radius: 12px;
                    --box-shadow: 0 8px 25px rgba(44, 62, 80, 0.4);
                    height: 50px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    color: #ffffff;
                }
                
                .login-button:hover {
                    --box-shadow: 0 12px 35px rgba(44, 62, 80, 0.6);
                    --color: #ffffff !important;
                    color: #ffffff;
                    transform: translateY(-2px);
                }
                
                /* Botón login en modo oscuro */
                @media (prefers-color-scheme: dark) {
                    .login-button {
                        --background: linear-gradient(135deg, #e2e8f0 0%, #f7fafc 100%);
                        --background-activated: linear-gradient(135deg, #cbd5e0 0%, #e2e8f0 100%);
                        --color: #2d3748 !important;
                        --box-shadow: 0 8px 25px rgba(226, 232, 240, 0.3);
                        color: #2d3748;
                    }
                    
                    .login-button:hover {
                        --box-shadow: 0 12px 35px rgba(226, 232, 240, 0.4);
                        --color: #2d3748 !important;
                        color: #2d3748;
                    }
                }
                
                .login-divider {
                    text-align: center;
                    margin: 25px 0;
                    position: relative;
                }
                
                .login-divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, #d1d9e0 20%, #d1d9e0 80%, transparent 100%);
                }
                
                .login-divider span {
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.98) 100%);
                    padding: 0 20px;
                    color: #6c7b7f;
                    font-weight: 500;
                }
                
                .register-button {
                    --color: #4a5568;
                    --border-color: #4a5568;
                    --border-radius: 12px;
                    height: 45px;
                    font-weight: 500;
                    margin-bottom: 15px;
                    transition: all 0.3s ease;
                }
                
                .register-button:hover {
                    --background: rgba(74, 85, 104, 0.05);
                    transform: translateY(-1px);
                }
                
                .home-button {
                    --color: #6c7b7f;
                    height: 40px;
                    font-weight: 400;
                    text-decoration: underline;
                }
                
                .home-button:hover {
                    --color: #4a4a4a;
                }
                
                /* Divider y botones en modo oscuro */
                @media (prefers-color-scheme: dark) {
                    .login-divider span {
                        background: linear-gradient(145deg, rgba(45, 45, 45, 0.95) 0%, rgba(35, 35, 35, 0.98) 100%);
                        color: #888888;
                    }
                    
                    .register-button {
                        --color: #a0aec0;
                        --border-color: #a0aec0;
                    }
                    
                    .register-button:hover {
                        --background: rgba(160, 174, 192, 0.1);
                    }
                    
                    .home-button {
                        --color: #888888;
                    }
                    
                    .home-button:hover {
                        --color: #b0b0b0;
                    }
                }
                
                @media (max-width: 768px) {
                    .login-card-content {
                        padding: 30px 20px;
                    }
                    
                    .login-title h1 {
                        font-size: 24px;
                    }
                    
                    .login-logo {
                        max-width: 100px;
                    }
                }
            `}</style>
        </IonContent>
    )
}