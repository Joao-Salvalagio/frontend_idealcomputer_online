import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo}>
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoIcon}
          >
            <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
            <line x1="4" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="2"/>
            <line x1="4" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="4" y1="15" x2="7" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="17" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="2"/>
            <line x1="17" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="17" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="4" x2="9" y2="7" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="4" x2="12" y2="7" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="4" x2="15" y2="7" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="17" x2="9" y2="20" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="20" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="17" x2="15" y2="20" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className={styles.logoText}>Ideal-Computer</span>
        </Link>

        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Início</Link>
          <Link to="/questionario" className={styles.navLink}>Montar PC</Link>
          
          {/* ✅ NOVO LINK: Minhas Builds (só aparece se estiver logado) */}
          {isLoggedIn && (
            <Link to="/minhas-builds" className={styles.navLink}>
              💾 Minhas Builds
            </Link>
          )}
          
          {isAdmin && (
            <Link to="/admin" className={styles.navLink}>
              🔐 Admin
            </Link>
          )}
        </div>

        <div className={styles.navActions}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isLoggedIn ? (
            <>
              <span className={styles.userName}>Olá, {user?.name}</span>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button className={styles.loginButton} onClick={() => navigate('/login')}>
                Entrar
              </button>
              <button className={styles.registerButton} onClick={() => navigate('/register')}>
                Registrar
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
