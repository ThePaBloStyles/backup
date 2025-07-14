import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { LoginPage } from './pages/Login/Login.page';
import Home from './pages/Home/Home.page';
import AdminPage from './pages/Admin/Admin.page';
import AdminUsersPage from './pages/Admin/AdminUsers.page';
import AdminProductsPage from './pages/Admin/AdminProducts.page';
import BodegaPage from './pages/Bodega/Bodega.page';
import FormulariosPage from './pages/Formularios/Formularios.page';
import RegisterPage from './pages/Register/Register.page';
import RubrosPage from './pages/Rubros/Rubro.page';
import UserAdministrationPage from './pages/UserAdministrations/userAdministration.page';
import UserDetailPage from './pages/UserAdministrations/UserDetail.page';
import ResultadosPage from './pages/Resultados/Resultado.page';
import { ItemProvider } from './contexts/Item.context';

setupIonicReact();

const Service = () => {
  return (
    <IonRouterOutlet>
        <Route exact path="/login">
        <LoginPage />
        </Route>
        <Route exact path="/register">
        <RegisterPage />
        </Route>
        <Route exact path="/home">
          <Home username="Joaquín" /> 
        </Route>
        <Route exact path="/admin">
          <AdminPage />
        </Route>
        <Route exact path="/admin/users">
          <AdminUsersPage />
        </Route>
        <Route exact path="/admin/products">
          <AdminProductsPage />
        </Route>
        <Route exact path="/bodega">
          <BodegaPage />
        </Route>
        <Route exact path="/Formularios">
          <FormulariosPage />
        </Route>
        <Route exact path="/Rubros">
          <RubrosPage />
        </Route>
        <Route exact path="/admUsuarios">
          <UserAdministrationPage/>
        </Route>
        <Route exact path="/admin/usuarios/:id">
          <UserDetailPage />
        </Route>
        <Route exact path="/resultados">
          <ResultadosPage/>
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
  )
}

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <ItemProvider>
        <Service></Service>
      </ItemProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
