import { 
    IonCol, IonContent, IonGrid, IonItem, IonLabel, IonRow, IonInput, IonButton, 
    IonCard, IonCardContent, IonIcon, IonText, IonSearchbar, IonBadge, IonHeader,
    IonToolbar, IonButtons, IonMenuToggle, IonImg
} from "@ionic/react"
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { menuOutline, person, cart, logOut, storefront, search, home } from 'ionicons/icons';
import { SideMenu } from '../../components/Menu';
import { ItemCard } from '../../components/ItemCard';
import { useItem } from '../../contexts/Item.context';
import { useCart } from '../../contexts/Cart.context';
import { useAuth } from '../../hooks/useAuth';

export const HomeContainer = () => {
    const { items } = useItem();
    const { cartCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const [searchText, setSearchText] = useState('');
    const history = useHistory();

    const handleLogout = () => {
        logout();
    };

    const handlePersonClick = () => {
        if (!isAuthenticated) {
            history.push('/login');
        } else if (user?.role === 'administrador' || user?.role === 'bodeguero') {
            history.push('/admin');
        } else {
            history.push('/profile');
        }
    };

    useEffect(() => {
        console.log({ items });
    }, [items]);

    return (
        <>
            <SideMenu />
            <IonContent className="home-content" id="main-content">
                <div className="home-background">
                    {/* Header Principal con el mismo estilo de la barra negra */}
                    <div className="header-section">
                        <IonToolbar className="home-toolbar">
                            <IonButtons slot="start" className="header-buttons">
                                <IonMenuToggle>
                                    <IonButton fill="clear" className="menu-button">
                                        <IonIcon slot="icon-only" icon={menuOutline} />
                                    </IonButton>
                                </IonMenuToggle>
                                
                                {/* Botón Home */}
                                <IonButton 
                                    fill="clear" 
                                    className="home-button"
                                    onClick={() => history.push('/')}
                                    title="Ir al inicio"
                                >
                                    <IonIcon slot="icon-only" icon={home} />
                                </IonButton>
                            </IonButtons>

                            {/* Barra de búsqueda */}
                            <div className="search-container">
                                <IonSearchbar
                                    value={searchText}
                                    onIonInput={(e) => setSearchText(e.detail.value!)}
                                    placeholder="Buscar productos..."
                                    className="modern-searchbar"
                                    searchIcon={search}
                                />
                            </div>

                            {/* Iconos de la derecha */}
                            <IonButtons slot="end" className="header-actions">
                                {isAuthenticated ? (
                                    <>
                                        <IonButton 
                                            onClick={handleLogout} 
                                            fill="clear" 
                                            className="logout-button"
                                            title="Cerrar sesión"
                                        >
                                            <IonIcon slot="icon-only" icon={logOut} />
                                        </IonButton>
                                        
                                        <IonButton 
                                            fill="clear" 
                                            className="profile-button" 
                                            onClick={handlePersonClick}
                                            title={user?.role === 'administrador' || user?.role === 'bodeguero' ? 'Panel Admin' : 'Mi Perfil'}
                                        >
                                            <IonIcon slot="icon-only" icon={person} />
                                        </IonButton>
                                    </>
                                ) : (
                                    <IonButton 
                                        fill="clear" 
                                        className="login-button" 
                                        onClick={handlePersonClick}
                                        title="Iniciar sesión"
                                    >
                                        <IonIcon slot="icon-only" icon={person} />
                                    </IonButton>
                                )}

                                <IonButton 
                                    fill="clear" 
                                    className="cart-button"
                                    onClick={() => history.push('/cart')}
                                    title="Carrito de compras"
                                >
                                    <IonIcon slot="icon-only" icon={cart} />
                                    {cartCount > 0 && (
                                        <IonBadge className="cart-badge">
                                            {cartCount}
                                        </IonBadge>
                                    )}
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </div>

                    {/* Bienvenida mejorada */}
                    <div className="welcome-section">
                        <IonGrid className="welcome-grid">
                            <IonRow className="ion-justify-content-center">
                                <IonCol sizeXl="8" sizeLg="9" sizeMd="10" sizeSm="11" sizeXs="12">
                                    <IonCard className="welcome-card">
                                        <IonCardContent className="welcome-card-content">
                                            <div className="welcome-header">
                                                <div className="logo-container-main">
                                                    <img 
                                                        src='./images/images.png' 
                                                        alt="Ferramax Logo"
                                                        className="welcome-logo"
                                                    />
                                                </div>
                                                <IonText className="welcome-title">
                                                    <h1>¡Bienvenido a Ferramax!</h1>
                                                </IonText>
                                                <IonText className="welcome-subtitle">
                                                    <p>Tu destino para herramientas, materiales y equipos de la más alta calidad</p>
                                                </IonText>
                                                
                                                {!isAuthenticated && (
                                                    <div className="welcome-actions">
                                                        <IonButton 
                                                            className="welcome-login-button" 
                                                            onClick={() => history.push('/login')}
                                                        >
                                                            <IonIcon icon={person} slot="start" />
                                                            Iniciar Sesión
                                                        </IonButton>
                                                        <IonButton 
                                                            className="welcome-register-button" 
                                                            routerLink="/register"
                                                        >
                                                            Crear Cuenta
                                                        </IonButton>
                                                    </div>
                                                )}
                                            </div>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>

                    {/* Sección de productos estirada */}
                    {items.length > 0 && (
                        <div className="products-main-section">
                            <IonGrid className="products-main-grid">
                                <IonRow className="ion-justify-content-center">
                                    <IonCol size="12">
                                        <div className="products-container">
                                            <div className="products-header">
                                                <h2>Nuestros Productos</h2>
                                                <p>Descubre nuestra amplia gama de productos profesionales</p>
                                            </div>
                                            
                                            <IonGrid className="products-display-grid">
                                                <IonRow className="products-row">
                                                    {items.map((item: any, index: number) => {
                                                        return (
                                                            <IonCol 
                                                                key={index} 
                                                                sizeXl='2.4' 
                                                                sizeLg='3' 
                                                                sizeMd='4' 
                                                                sizeSm='6' 
                                                                sizeXs='12' 
                                                                className="product-display-col"
                                                            >
                                                                <ItemCard item={item} />
                                                            </IonCol>
                                                        );
                                                    })}
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </div>
                    )}
                </div>

                <style>{`
                    .home-content {
                        --background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #4a5568 100%);
                    }
                    
                    .home-background {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #4a5568 100%);
                        display: flex;
                        flex-direction: column;
                        padding: 0;
                    }
                    
                    /* Soporte para modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .home-content {
                            --background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%);
                        }
                        
                        .home-background {
                            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%);
                        }
                    }
                    
                    .header-section {
                        position: relative;
                        z-index: 10;
                        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
                    }
                    
                    .home-toolbar {
                        --background: rgba(0, 0, 0, 0.8);
                        --color: white;
                        padding: 0 16px;
                        min-height: 64px;
                        backdrop-filter: blur(10px);
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    
                    /* Toolbar en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .home-toolbar {
                            --background: rgba(0, 0, 0, 0.95);
                            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                        }
                    }
                    
                    .header-buttons .menu-button {
                        --color: white;
                        --background-hover: rgba(255, 255, 255, 0.1);
                        --border-radius: 8px;
                    }
                    
                    .home-button {
                        --color: white;
                        --background-hover: rgba(255, 255, 255, 0.1);
                        --border-radius: 8px;
                        margin-left: 8px;
                        transition: all 0.3s ease;
                    }
                    
                    .home-button:hover {
                        transform: translateY(-1px);
                    }
                    
                    .search-container {
                        display: flex;
                        align-items: center;
                        flex: 1;
                        max-width: 500px;
                        margin: 0 20px;
                    }
                    
                    .modern-searchbar {
                        --background: rgba(255, 255, 255, 0.95);
                        --color: #2c3e50;
                        --border-radius: 25px;
                        --box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                        --placeholder-color: #6c7b7f;
                        border: none;
                        backdrop-filter: blur(10px);
                    }
                    
                    /* Searchbar en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .modern-searchbar {
                            --background: rgba(45, 45, 45, 0.95);
                            --color: #e0e0e0;
                            --placeholder-color: #b0b0b0;
                            --box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        }
                    }
                    
                    .header-actions {
                        gap: 8px;
                    }
                    
                    .logout-button, .profile-button, .login-button, .cart-button {
                        --color: white !important;
                        --background-hover: rgba(255, 255, 255, 0.1);
                        --border-radius: 8px;
                        position: relative;
                        transition: all 0.3s ease;
                        color: white;
                    }
                    
                    .logout-button:hover, .profile-button:hover, .login-button:hover, .cart-button:hover {
                        transform: translateY(-1px);
                        --color: white !important;
                        color: white;
                    }
                    
                    /* Asegurar que los iconos siempre sean blancos en el header */
                    .logout-button ion-icon, .profile-button ion-icon, .login-button ion-icon, .cart-button ion-icon {
                        color: white !important;
                    }
                    
                    .cart-badge {
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        font-size: 10px;
                        min-width: 18px;
                        height: 18px;
                        --background: #e74c3c;
                        --color: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    /* Sección de Bienvenida Mejorada */
                    .welcome-section {
                        padding: 30px 20px;
                    }
                    
                    .welcome-grid {
                        margin: 0;
                    }
                    
                    .welcome-card {
                        margin: 0;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                        border-radius: 25px;
                        overflow: hidden;
                        backdrop-filter: blur(15px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.98) 100%);
                    }
                    
                    /* Welcome card en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .welcome-card {
                            background: linear-gradient(145deg, rgba(45, 45, 45, 0.95) 0%, rgba(35, 35, 35, 0.98) 100%);
                            border: 1px solid rgba(255, 255, 255, 0.05);
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
                        }
                    }
                    
                    .welcome-card-content {
                        padding: 50px 40px;
                        text-align: center;
                    }
                    
                    .welcome-header {
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    
                    .logo-container-main {
                        margin-bottom: 25px;
                    }
                    
                    .welcome-logo {
                        max-width: 140px;
                        height: auto;
                        filter: drop-shadow(0 6px 12px rgba(74, 74, 74, 0.3));
                    }
                    
                    .welcome-title h1 {
                        margin: 0 0 15px 0;
                        font-size: 36px;
                        font-weight: 800;
                        color: #2c3e50;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        line-height: 1.2;
                    }
                    
                    .welcome-subtitle p {
                        margin: 0 0 30px 0;
                        color: #5a6c7d;
                        font-size: 18px;
                        font-weight: 400;
                        line-height: 1.5;
                    }
                    
                    /* Títulos en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .welcome-title h1 {
                            color: #e0e0e0;
                            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                        }
                        
                        .welcome-subtitle p {
                            color: #b0b0b0;
                        }
                    }
                    
                    .welcome-actions {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                        margin-top: 30px;
                    }
                    
                    .welcome-login-button {
                        --background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                        --background-activated: linear-gradient(135deg, #1a252f 0%, #2c3e50 100%);
                        --color: #ffffff !important;
                        --border-radius: 15px;
                        --box-shadow: 0 8px 30px rgba(44, 62, 80, 0.4);
                        height: 50px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        min-width: 160px;
                        color: #ffffff;
                    }
                    
                    .welcome-login-button:hover {
                        --box-shadow: 0 12px 40px rgba(44, 62, 80, 0.6);
                        --color: #ffffff !important;
                        color: #ffffff;
                        transform: translateY(-3px);
                    }
                    
                    .welcome-register-button {
                        --background: linear-gradient(135deg, #4a5568 0%, #718096 100%);
                        --background-activated: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
                        --color: #ffffff !important;
                        --border-radius: 15px;
                        --box-shadow: 0 8px 30px rgba(74, 85, 104, 0.4);
                        height: 50px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        min-width: 160px;
                        color: #ffffff;
                    }
                    
                    .welcome-register-button:hover {
                        --box-shadow: 0 12px 40px rgba(74, 85, 104, 0.6);
                        --color: #ffffff !important;
                        color: #ffffff;
                        transform: translateY(-3px);
                    }
                    
                    /* Botones en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .welcome-login-button {
                            --background: linear-gradient(135deg, #e2e8f0 0%, #f7fafc 100%);
                            --background-activated: linear-gradient(135deg, #cbd5e0 0%, #e2e8f0 100%);
                            --color: #2d3748 !important;
                            --box-shadow: 0 8px 30px rgba(226, 232, 240, 0.3);
                            color: #2d3748;
                        }
                        
                        .welcome-login-button:hover {
                            --box-shadow: 0 12px 40px rgba(226, 232, 240, 0.4);
                            --color: #2d3748 !important;
                            color: #2d3748;
                        }
                        
                        .welcome-register-button {
                            --background: linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%);
                            --background-activated: linear-gradient(135deg, #718096 0%, #a0aec0 100%);
                            --color: #1a202c !important;
                            --box-shadow: 0 8px 30px rgba(160, 174, 192, 0.3);
                            color: #1a202c;
                        }
                        
                        .welcome-register-button:hover {
                            --box-shadow: 0 12px 40px rgba(160, 174, 192, 0.4);
                            --color: #1a202c !important;
                            color: #1a202c;
                        }
                    }
                    
                    /* Sección de Productos Estirada */
                    .products-main-section {
                        flex: 1;
                        padding: 20px;
                        background: rgba(255, 255, 255, 0.03);
                    }
                    
                    /* Sección de productos en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .products-main-section {
                            background: rgba(0, 0, 0, 0.1);
                        }
                    }
                    
                    .products-main-grid {
                        margin: 0;
                        max-width: none;
                    }
                    
                    .products-container {
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 20px;
                        padding: 40px 30px;
                        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    /* Contenedor de productos en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .products-container {
                            background: rgba(35, 35, 35, 0.95);
                            border: 1px solid rgba(255, 255, 255, 0.05);
                            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
                        }
                    }
                    
                    .products-header {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    
                    .products-header h2 {
                        margin: 0 0 15px 0;
                        font-size: 32px;
                        font-weight: 700;
                        color: #2c3e50;
                        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    }
                    
                    .products-header p {
                        margin: 0;
                        font-size: 16px;
                        color: #5a6c7d;
                        font-weight: 400;
                    }
                    
                    /* Headers de productos en modo oscuro */
                    @media (prefers-color-scheme: dark) {
                        .products-header h2 {
                            color: #e0e0e0;
                            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                        }
                        
                        .products-header p {
                            color: #b0b0b0;
                        }
                    }
                    
                    .products-display-grid {
                        margin: 0;
                        padding: 0;
                    }
                    
                    .products-row {
                        margin: 0;
                        justify-content: center;
                    }
                    
                    .product-display-col {
                        padding: 12px;
                        display: flex;
                        justify-content: center;
                    }
                    
                    /* Mejoras en las tarjetas de productos */
                    .product-display-col ion-card {
                        width: 100%;
                        max-width: 280px;
                        transition: all 0.3s ease;
                    }
                    
                    .product-display-col ion-card:hover {
                        transform: translateY(-8px) scale(1.02);
                        box-shadow: 0 15px 40px rgba(74, 74, 74, 0.25);
                    }
                    
                    /* Responsive Design Mejorado */
                    @media (max-width: 1200px) {
                        .welcome-title h1 {
                            font-size: 32px;
                        }
                        
                        .products-header h2 {
                            font-size: 28px;
                        }
                    }
                    
                    @media (max-width: 768px) {
                        .search-container {
                            margin: 0 10px;
                            max-width: none;
                        }
                        
                        .welcome-section {
                            padding: 20px 15px;
                        }
                        
                        .welcome-card-content {
                            padding: 35px 25px;
                        }
                        
                        .welcome-title h1 {
                            font-size: 28px;
                        }
                        
                        .welcome-subtitle p {
                            font-size: 16px;
                        }
                        
                        .welcome-actions {
                            flex-direction: column;
                            align-items: center;
                        }
                        
                        .welcome-login-button, .welcome-register-button {
                            width: 100%;
                            max-width: 280px;
                        }
                        
                        .products-container {
                            padding: 30px 20px;
                        }
                        
                        .products-header h2 {
                            font-size: 24px;
                        }
                        
                        .product-display-col {
                            padding: 8px;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        .header-logo {
                            width: 100px;
                            height: 30px;
                        }
                        
                        .search-container {
                            margin: 0 5px;
                        }
                        
                        .welcome-section {
                            padding: 15px 10px;
                        }
                        
                        .welcome-card-content {
                            padding: 25px 20px;
                        }
                        
                        .welcome-title h1 {
                            font-size: 24px;
                        }
                        
                        .welcome-logo {
                            max-width: 100px;
                        }
                        
                        .products-main-section {
                            padding: 15px 10px;
                        }
                        
                        .products-container {
                            padding: 25px 15px;
                        }
                        
                        .products-header h2 {
                            font-size: 22px;
                        }
                        
                        .product-display-col {
                            padding: 6px;
                        }
                    }
                `}</style>
            </IonContent>
        </>
    )
}
