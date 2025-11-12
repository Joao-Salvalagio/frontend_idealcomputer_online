import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Admin.module.css';

const Admin = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>🔐 Painel Administrativo</h1>
          <p>Gerenciamento de componentes do sistema</p>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.welcomeText}>Bem-vindo,</span>
          <strong>{user?.name}</strong>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Card de Gerenciamento de Usuários - DESTAQUE */}
        <Link to="/admin/usuarios" className={`${styles.card} ${styles.featuredCard}`}>
          <div className={styles.cardIcon}>👥</div>
          <h3>Gerenciar Usuários</h3>
          <p>Visualizar, editar e remover usuários do sistema</p>
          <span className={styles.cardBadge}>Novo</span>
        </Link>

        {/* Cards de Componentes - AGORA COM LINKS */}
        <Link to="/admin/cpus" className={styles.card}>
          <div className={styles.cardIcon}>🔧</div>
          <h3>CPU</h3>
          <p>Gerenciar processadores</p>
        </Link>

        <Link to="/admin/gpus" className={styles.card}>
          <div className={styles.cardIcon}>🎮</div>
          <h3>GPU</h3>
          <p>Gerenciar placas de vídeo</p>
        </Link>

        <Link to="/admin/placas-mae" className={styles.card}>
          <div className={styles.cardIcon}>💾</div>
          <h3>Placa-mãe</h3>
          <p>Gerenciar placas-mãe</p>
        </Link>

        <Link to="/admin/memorias-ram" className={styles.card}>
          <div className={styles.cardIcon}>🧠</div>
          <h3>Memória RAM</h3>
          <p>Gerenciar memórias RAM</p>
        </Link>

        <Link to="/admin/armazenamentos" className={styles.card}>
          <div className={styles.cardIcon}>💿</div>
          <h3>Armazenamento</h3>
          <p>Gerenciar HDs e SSDs</p>
        </Link>

        <Link to="/admin/fontes" className={styles.card}>
          <div className={styles.cardIcon}>⚡</div>
          <h3>Fonte</h3>
          <p>Gerenciar fontes de alimentação</p>
        </Link>

        <Link to="/admin/gabinetes" className={styles.card}>
          <div className={styles.cardIcon}>📦</div>
          <h3>Gabinete</h3>
          <p>Gerenciar gabinetes</p>
        </Link>

        <Link to="/admin/refrigeracoes" className={styles.card}>
          <div className={styles.cardIcon}>❄️</div>
          <h3>Refrigeração</h3>
          <p>Gerenciar sistemas de refrigeração</p>
        </Link>
      </div>
    </div>
  );
};

export default Admin;