import api from './api';

export interface AuthRequest {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role?: string;
}

export const authService = {
  async register(data: AuthRequest): Promise<string> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: AuthRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    // 🔍 DEBUG: Ver o que o backend realmente retornou
    console.log('🔵 Resposta COMPLETA do backend:', response.data);
    console.log('🔵 Campos recebidos:', Object.keys(response.data));
    
    const { token, email, name, role } = response.data;
    
    console.log('🔵 Token:', token);
    console.log('🔵 Email:', email);
    console.log('🔵 Name:', name);
    console.log('🔵 Role:', role); // ← Aqui vamos ver se vem undefined
    
    // Salvar tudo no localStorage
    localStorage.setItem('token', token);
    
    const userData = { email, name, role };
    console.log('🔵 Salvando no localStorage:', userData);
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ localStorage.getItem("user"):', localStorage.getItem('user'));
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAdmin(): boolean {
    const user = this.getUser();
    console.log('🔍 Verificando isAdmin() - user:', user);
    return user?.role === 'ADMIN' || user?.role === 'ADMINISTRADOR';
  }
};