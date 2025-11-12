import React, { useEffect } from 'react';
import styles from './Recomendacao.module.css';
import { useNavigate } from 'react-router-dom';
import { useRecommendation } from '../contexts/RecommendationContext';

const Recomendacao: React.FC = () => {
  const navigate = useNavigate();
  const { recommendation, questionnaireData } = useRecommendation();

  useEffect(() => {
    // Redireciona se não houver recomendação
    if (!recommendation) {
      console.warn('⚠️ Nenhuma recomendação encontrada. Redirecionando...');
      navigate('/questionario');
    } else {
      console.log('✅ Recomendação carregada:', recommendation);
      console.log('✅ Dados do questionário:', questionnaireData);
    }
  }, [recommendation, navigate, questionnaireData]);

  // Loading state
  if (!recommendation) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Carregando recomendação...</p>
        </div>
      </div>
    );
  }

  // ✅ CALCULA PREÇO TOTAL
  const totalPrice = 
    (recommendation.cpu?.preco || 0) +
    (recommendation.placaMae?.preco || 0) +
    (recommendation.gpu?.preco || 0) +
    (recommendation.memoriaRam?.preco || 0) +
    (recommendation.armazenamento?.preco || 0) +
    (recommendation.fonte?.preco || 0) +
    (recommendation.gabinete?.preco || 0) +
    (recommendation.refrigeracao?.preco || 0);

  // Mapeia finalidades
  const buildNames: { [key: string]: string } = {
    'Jogos': 'Gaming',
    'Trabalho': 'Trabalho',
    'Estudos': 'Estudos'
  };

  // Mapeia orçamentos
  const budgetNames: { [key: string]: string } = {
    'econômico': 'Econômica',
    'intermediário': 'Intermediária',
    'alto': 'Alta Performance',
    'extremo': 'Extrema'
  };

  const buildName = questionnaireData 
    ? `Build ${buildNames[questionnaireData.usage] || questionnaireData.usage} ${budgetNames[questionnaireData.budget] || questionnaireData.budget}`
    : 'Sua Build Personalizada';

  // ✅ CORRIGIDO: Conta TODOS os componentes
  const componentCount = 
    (recommendation.cpu ? 1 : 0) +
    (recommendation.placaMae ? 1 : 0) +
    (recommendation.gpu ? 1 : 0) +
    (recommendation.memoriaRam ? 1 : 0) +
    (recommendation.armazenamento ? 1 : 0) +
    (recommendation.fonte ? 1 : 0) +
    (recommendation.gabinete ? 1 : 0) +
    (recommendation.refrigeracao ? 1 : 0);

  // ✅ CORRIGIDO: Justificativas COMPLETAS para TODOS os componentes
  const razoes: string[] = [];

  // 1. CPU
  if (recommendation.cpu) {
    razoes.push(
      `${recommendation.cpu.nome} - Processador ${recommendation.cpu.marca} de alto desempenho com ${recommendation.cpu.potenciaRecomendadaW}W TDP`
    );
  }

  // 2. Placa-mãe
  if (recommendation.placaMae) {
    razoes.push(
      `${recommendation.placaMae.nome} - Placa-mãe ${recommendation.placaMae.formato} com chipset moderno e suporte a ${recommendation.placaMae.tipoRamSuportado}`
    );
  }

  // 3. GPU
  if (recommendation.gpu) {
    razoes.push(
      `${recommendation.gpu.nome} - GPU ${recommendation.gpu.marca} com ${recommendation.gpu.memoriaVram}GB VRAM para jogos em alta qualidade`
    );
  } else {
    razoes.push(
      'Processador com gráficos integrados suficientes para tarefas do dia a dia'
    );
  }

  // 4. Memória RAM
  if (recommendation.memoriaRam) {
    razoes.push(
      `${recommendation.memoriaRam.nome} - ${recommendation.memoriaRam.capacidadeGb}GB ${recommendation.memoriaRam.tipo} @ ${recommendation.memoriaRam.frequenciaMhz}MHz para multitasking fluido`
    );
  }

  // 5. Armazenamento
  if (recommendation.armazenamento) {
    razoes.push(
      `${recommendation.armazenamento.nome} - ${recommendation.armazenamento.tipo} de ${recommendation.armazenamento.capacidadeGb}GB para velocidade e confiabilidade`
    );
  }

  // 6. Fonte
  if (recommendation.fonte) {
    razoes.push(
      `${recommendation.fonte.nome} - Fonte ${recommendation.fonte.potenciaWatts}W ${recommendation.fonte.formato} com margem de segurança`
    );
  }

  // 7. Gabinete
  if (recommendation.gabinete) {
    razoes.push(
      `${recommendation.gabinete.nome} - Gabinete ${recommendation.gabinete.marca} com suporte a ${recommendation.gabinete.formatosPlacaMaeSuportados}`
    );
  }

  // 8. Refrigeração
  if (recommendation.refrigeracao) {
    razoes.push(
      `${recommendation.refrigeracao.nome} - ${recommendation.refrigeracao.tipo} para temperaturas ideais e desempenho sustentado`
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>📈 Recomendação Personalizada</div>
        <h2>Por que essa build?</h2>
        <p className={styles.subtitle}>Entenda as razões por trás de cada escolha</p>
      </div>

      <div className={styles.buildCard}>
        <div className={styles.buildHeader}>
          <h3>{buildName}</h3>
          <div className={styles.preco}>
            R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className={styles.justificativasSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.checkIcon}>✓</span>
            <h4>Justificativas da Recomendação</h4>
          </div>
          <p className={styles.sectionSubtitle}>Cada componente foi escolhido estrategicamente</p>
          
          <div className={styles.razoesList}>
            {razoes.map((razao, index) => (
              <div key={index} className={styles.razaoItem}>
                <span className={styles.checkSmall}>✓</span>
                <span>{razao}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.metricas}>
          <div className={styles.metricaCard}>
            <div className={styles.metricaValue}>{componentCount}</div>
            <div className={styles.metricaLabel}>Componentes</div>
          </div>
          <div className={styles.metricaCard}>
            <div className={`${styles.metricaValue} ${styles.green}`}>100%</div>
            <div className={styles.metricaLabel}>Compatibilidade</div>
          </div>
          <div className={styles.metricaCard}>
            <div className={styles.metricaValue}>⭐⭐⭐⭐⭐</div>
            <div className={styles.metricaLabel}>Performance</div>
          </div>
        </div>

      <div className={styles.actions}>
        <button 
          className={styles.primaryButton} 
          onClick={() => navigate('/detalhes-componentes')}
          >
           Ver mais detalhes → Peças, Valores e Opções de Salvar e Exportar Build
          </button>
          <button 
          className={styles.secondaryButton} 
          onClick={() => navigate('/questionario')}
          >
          Refazer questionário
        </button>
      </div>
      </div>
    </div>
  );
};

export default Recomendacao;
