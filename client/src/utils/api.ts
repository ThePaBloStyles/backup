import axios from 'axios';

// Configurar la URL base para el API
const API_BASE_URL = 'http://localhost:7000';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentar timeout a 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir automáticamente el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Timeout en petición API');
      // No redirigir en timeout, dejar que el componente maneje el error
      return Promise.reject({
        ...error,
        message: 'Tiempo de espera agotado. Verifica tu conexión a internet.',
        code: 'TIMEOUT'
      });
    }
    
    if (error.response?.status === 401) {
      console.error('Error 401: No autorizado');
      // Manejar errores de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      
      // Solo redirigir si no estamos ya en login o checkout
      if (window.location.pathname !== '/login' && window.location.pathname !== '/checkout') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
