import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../utils/api';

interface User {
  email: string;
  name: string;
  lastName: string;
  role: string;
  _id: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // Verificación inicial rápida: si no hay token, no mostrar loading
  const initialToken = localStorage.getItem('token');
  const [loading, setLoading] = useState(!!initialToken);
  const [authMessage, setAuthMessage] = useState(initialToken ? '' : 'Inicie sesión por favor');
  const history = useHistory();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Si no hay token, inmediatamente retornar false
      if (!token || token === 'null' || token === 'undefined') {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        setAuthMessage('Inicie sesión por favor');
        return false;
      }

      // Si hay token, intentar verificar pero con timeout más corto
      setAuthMessage('Verificando su sesión...');
      
      try {
        const response = await Promise.race([
          api.get('/api/auth/verify'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000) // 3 segundos máximo
          )
        ]) as any;

        if (response.status === 200 && response.data && response.data.success) {
          const data = response.data;
          setIsAuthenticated(true);
          setUser(data.user);
          setLoading(false);
          setAuthMessage('');
          return true;
        } else {
          throw new Error('Respuesta inválida');
        }
      } catch (error: any) {
        console.log('Error en verificación:', error.message);
        
        // Si es timeout o error de red, intentar una vez más
        if (error.message === 'Timeout' || error.code === 'NETWORK_ERROR') {
          try {
            const retryResponse = await api.get('/api/auth/verify');
            if (retryResponse.status === 200 && retryResponse.data && retryResponse.data.success) {
              const data = retryResponse.data;
              setIsAuthenticated(true);
              setUser(data.user);
              setLoading(false);
              setAuthMessage('');
              return true;
            }
          } catch (retryError) {
            console.log('Error en segundo intento:', retryError);
          }
        }
        
        // Cualquier error = limpiar y mostrar login
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        setAuthMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return false;
      }
    } catch (error) {
      console.error('Error general en checkAuth:', error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      setAuthMessage('Error de conexión. Por favor, inicia sesión nuevamente.');
      return false;
    }
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userData.role);
    setIsAuthenticated(true);
    setUser(userData);
    setAuthMessage('');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUser(null);
    setAuthMessage('Sesión cerrada correctamente');
    history.push('/login');
  };

  const requireAuth = (redirectTo: string = '/login') => {
    if (!isAuthenticated && !loading) {
      history.push(redirectTo);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token || token === 'null' || token === 'undefined') {
      // Si no hay token válido, inmediatamente mostrar login
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setAuthMessage('Inicie sesión por favor');
      return;
    }

    // Timeout de seguridad de 5 segundos
    const timeoutId = setTimeout(() => {
      console.log('Timeout de verificación alcanzado');
      setLoading(false);
      setAuthMessage('Error de conexión. Por favor, inicia sesión nuevamente.');
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    }, 5000);

    // Ejecutar verificación
    checkAuth().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    authMessage,
    login,
    logout,
    requireAuth,
    checkAuth
  };
};
