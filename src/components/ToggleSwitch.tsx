import React from 'react';
import styles from './ToggleSwitch.module.css';
import { useTheme } from '../contexts/ThemeContext';

const ToggleSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.toggleContainer} 
      onClick={toggleTheme}
      aria-label="Alternar tema"
    >
      <div className={`${styles.toggle} ${theme === 'light' ? styles.light : styles.dark}`}>
        <div className={styles.iconWrapper}>
          {theme === 'dark' ? (
            <span className={styles.icon}>🌙</span>
          ) : (
            <span className={styles.icon}>☀️</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ToggleSwitch;
