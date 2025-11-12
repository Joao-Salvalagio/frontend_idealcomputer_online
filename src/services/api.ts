import axios from 'axios';

// ✅ USA VARIÁVEL DE AMBIENTE (local vs produção)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ INTERCEPTOR: Adiciona token (exceto em rotas de auth)
api.interceptors.request.use(
  (config) => {
    const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    
    if (!isAuthRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
