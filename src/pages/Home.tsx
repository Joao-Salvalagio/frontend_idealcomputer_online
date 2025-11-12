import React from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.hero}>
        <h1>Monte seu PC<br /><span className={styles.highlight}>dos sonhos</span></h1>
        <p>Receba recomendações personalizadas de peças para seu computador ideal. Nossa inteligência artificial analisa suas necessidades e orçamento.</p>
        <button className={styles.montarButton} onClick={() => navigate('/questionario')}>
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
          Montar PC
        </button>
      </div>
      
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
              <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <h3>Recomendações Personalizadas</h3>
          <p>Algoritmo inteligente que considera seu uso, orçamento e preferências para sugerir a configuração perfeita.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Performance Otimizada</h3>
          <p>Configurações balanceadas que garantem máxima performance dentro do seu orçamento disponível.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Compatibilidade Garantida</h3>
          <p>Todas as peças são verificadas para compatibilidade total, evitando problemas na montagem.</p>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <h2>Pronto para começar?</h2>
        <p>Responda algumas perguntas simples e receba sua recomendação personalizada em instantes.</p>
        <button className={styles.ctaButton} onClick={() => navigate('/questionario')}>
          Começar agora
        </button>
      </div>
    </div>
  );
};

export default Home;
