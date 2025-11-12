import type { User } from '../services/userService';
import styles from './UserTable.module.css';

interface UserTableProps {
  users: User[];
  currentUserId: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable = ({ users, currentUserId, onEdit, onDelete }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>😕</span>
        <p>Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser = user.email === currentUserId;
            
            return (
              <tr key={user.id} className={isCurrentUser ? styles.currentUser : ''}>
                <td>{user.id}</td>
                <td>
                  <div className={styles.userName}>
                    {user.name}
                    {isCurrentUser && (
                      <span className={styles.badge}>Você</span>
                    )}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.cargo}</td>
                <td>
                  <span
                    className={
                      user.funcao === 'ADMINISTRADOR'
                        ? styles.roleAdmin
                        : styles.roleUser
                    }
                  >
                    {user.funcao === 'ADMINISTRADOR' ? '🔐 Admin' : '👤 Usuário'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => onEdit(user)}
                      className={styles.editButton}
                      title="Editar usuário"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className={styles.deleteButton}
                      title="Excluir usuário"
                      disabled={isCurrentUser}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
