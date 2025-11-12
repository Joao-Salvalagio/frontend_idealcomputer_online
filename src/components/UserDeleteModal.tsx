import type { User } from '../services/userService';
import styles from './UserModal.module.css';

interface UserDeleteModalProps {
  user: User;
  onConfirm: () => void;
  onClose: () => void;
}

const UserDeleteModal = ({ user, onConfirm, onClose }: UserDeleteModalProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>⚠️ Confirmar Exclusão</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.deleteContent}>
          <p>Tem certeza que deseja excluir o usuário:</p>
          <div className={styles.userInfo}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <p className={styles.warning}>
            ⚠️ Esta ação não pode ser desfeita!
          </p>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles.deleteButton}>
            Excluir Usuário
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
