import React from 'react';
import styles from './Logo.module.css';

const Logo: React.FC = () => {
  return (
    <div className={styles.logoIcon}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </div>
  );
};

export default Logo;
