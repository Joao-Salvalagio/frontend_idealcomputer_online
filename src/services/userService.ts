import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  cargo: string;
  funcao: 'USUARIO' | 'ADMINISTRADOR';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  cargo?: string;
  funcao?: 'USUARIO' | 'ADMINISTRADOR';
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/api/usuarios');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await api.put(`/api/usuarios/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/usuarios/${id}`);
  },

  async search(query: string): Promise<User[]> {
    const response = await api.get(`/api/usuarios/search?q=${query}`);
    return response.data;
  },
};
