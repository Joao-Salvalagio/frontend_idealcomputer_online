import { useState } from 'react';
import type { User } from '../services/userService';
import styles from './UserModal.module.css';

interface UserEditModalProps {
  user: User;
  onSave: (data: Partial<User>) => void;
  onClose: () => void;
}

const UserEditModal = ({ user, onSave, onClose }: UserEditModalProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [cargo, setCargo] = useState(user.cargo);
  const [funcao, setFuncao] = useState(user.funcao);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, cargo, funcao });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>✏️ Editar Usuário</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cargo">Cargo</label>
            <input
              id="cargo"
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Ex: Gerente, Cliente, Técnico"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="funcao">Função</label>
            <select
              id="funcao"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value as 'USUARIO' | 'ADMINISTRADOR')}
              required
            >
              <option value="USUARIO">👤 Usuário</option>
              <option value="ADMINISTRADOR">🔐 Administrador</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
