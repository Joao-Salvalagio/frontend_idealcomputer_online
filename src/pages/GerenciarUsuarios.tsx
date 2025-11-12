import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as userServiceModule from '../services/userService';
import type { User } from '../services/userService';
import UserTable from '../components/UserTable';
import UserEditModal from '../components/UserEditModal';
import UserDeleteModal from '../components/UserDeleteModal';
import styles from './GerenciarUsuarios.module.css';

const { userService } = userServiceModule;

const GerenciarUsuarios = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.cargo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar lista de usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (updatedData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      await userService.update(selectedUser.id, updatedData);
      await loadUsers();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      alert('Erro ao atualizar usuário. Verifique se o backend liberou o endpoint PUT.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await userService.delete(userToDelete.id);
      await loadUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      alert('Erro ao deletar usuário. Verifique se o backend liberou o endpoint DELETE.');
    }
  };

  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.funcao === 'ADMINISTRADOR').length,
    usuarios: users.filter((u) => u.funcao === 'USUARIO').length,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>👥 Gerenciamento de Usuários</h1>
          <p>Administre todos os usuários do sistema</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total de Usuários</span>
            <span className={styles.statValue}>{userStats.total}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔐</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Administradores</span>
            <span className={styles.statValue}>{userStats.admins}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👤</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Usuários Comuns</span>
            <span className={styles.statValue}>{userStats.usuarios}</span>
          </div>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Buscar por nome, email ou cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>Carregando usuários...</div>
      ) : (
        <UserTable
          users={filteredUsers}
          currentUserId={currentUser?.email || ''}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onSave={handleSaveEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {isDeleteModalOpen && userToDelete && (
        <UserDeleteModal
          user={userToDelete}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default GerenciarUsuarios;
