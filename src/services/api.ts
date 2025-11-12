import axios from 'axios';

// ✅ Detecta automaticamente o ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ INTERCEPTOR: Adiciona token automaticamente (exceto em rotas de autenticação)
api.interceptors.request.use(
  (config) => {
    // ✅ Verificar se é rota de login/register
    const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    
    // ✅ Só adiciona token se NÃO for rota de autenticação
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

// ✅ INTERCEPTOR DE RESPOSTA: Trata erros automaticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Se receber 401 (Unauthorized), remove o token e redireciona para o login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
