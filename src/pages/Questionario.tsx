import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecommendation } from '../contexts/RecommendationContext';
import { recommendationService } from '../services/recommendationService';
import styles from './Questionario.module.css';

const Questionario = () => {
  const navigate = useNavigate();
  const { setRecommendation, setQuestionnaireData } = useRecommendation();
  
  // Estado das etapas
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Dados do formulário
  const [formData, setFormData] = useState({
    usage: '',
    detail: '',
    budget: ''
  });

  // ===========================
  // ETAPA 1: Finalidade
  // ===========================
  const usageOptions = [
    {
      value: 'Jogos',
      label: 'Jogos',
      icon: '🎮',
      description: 'PC para games e entretenimento'
    },
    {
      value: 'Trabalho',
      label: 'Trabalho',
      icon: '💼',
      description: 'Produtividade e profissional'
    },
    {
      value: 'Estudos',
      label: 'Estudos',
      icon: '🎓',
      description: 'Acadêmico e aprendizado'
    }
  ];

  // ===========================
  // ETAPA 2: Detalhamento (COM ÍCONES)
  // ===========================
  const getDetailOptions = () => {
    switch (formData.usage) {
      case 'Jogos':
        return [
          { 
            value: 'Jogos Leves', 
            label: 'Jogos Leves', 
            icon: '🕹️',
            description: 'Jogos casuais, indie, navegador'
          },
          { 
            value: 'Jogos Intermediários', 
            label: 'Jogos Intermediários', 
            icon: '🎯',
            description: 'Jogos moderados em Full HD'
          },
          { 
            value: 'Jogos Pesados', 
            label: 'Jogos Pesados', 
            icon: '🚀',
            description: 'Jogos AAA em alta qualidade'
          },
          { 
            value: 'Todo Tipo de Jogo', 
            label: 'Todo Tipo de Jogo', 
            icon: '⚡',
            description: 'Máximo desempenho em qualquer jogo'
          }
        ];
      case 'Trabalho':
        return [
          { 
            value: 'Office Básico', 
            label: 'Office Básico', 
            icon: '📄',
            description: 'Word, Excel, navegação'
          },
          { 
            value: 'Programação', 
            label: 'Programação', 
            icon: '💻',
            description: 'IDEs, compiladores, VMs'
          },
          { 
            value: 'Design Gráfico', 
            label: 'Design Gráfico', 
            icon: '🎨',
            description: 'Photoshop, Illustrator'
          },
          { 
            value: 'Edição de Vídeo', 
            label: 'Edição de Vídeo', 
            icon: '🎬',
            description: 'Premiere, After Effects'
          }
        ];
      case 'Estudos':
        return [
          { 
            value: 'Estudos Básicos', 
            label: 'Estudos Básicos', 
            icon: '📚',
            description: 'Navegação, pesquisas, PDFs'
          },
          { 
            value: 'Programação Acadêmica', 
            label: 'Programação', 
            icon: '👨‍💻',
            description: 'Linguagens, projetos acadêmicos'
          },
          { 
            value: 'Engenharia', 
            label: 'Engenharia', 
            icon: '⚙️',
            description: 'AutoCAD, SolidWorks, simulações'
          },
          { 
            value: 'Multimídia', 
            label: 'Multimídia', 
            icon: '🎥',
            description: 'Edição, design, criação de conteúdo'
          }
        ];
      default:
        return [];
    }
  };

  // ===========================
  // ETAPA 3: Orçamento
  // ===========================
  const budgetOptions = [
    {
      value: 'econômico',
      label: 'Econômico',
      price: 'R$ 2.000 - 4.000',
      color: '#22c55e'
    },
    {
      value: 'intermediário',
      label: 'Intermediário',
      price: 'R$ 4.000 - 7.000',
      color: '#3b82f6'
    },
    {
      value: 'alto',
      label: 'Alto',
      price: 'R$ 7.000 - 12.000',
      color: '#a855f7'
    },
    {
      value: 'extremo',
      label: 'Extremo',
      price: 'R$ 12.000+',
      color: '#ef4444'
    }
  ];

  // ===========================
  // HANDLERS
  // ===========================
  const handleSelectUsage = (value: string) => {
    setFormData({ ...formData, usage: value, detail: '' });
  };

  const handleSelectDetail = (value: string) => {
    setFormData({ ...formData, detail: value });
  };

  const handleSelectBudget = (value: string) => {
    setFormData({ ...formData, budget: value });
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.usage) {
      alert('Por favor, selecione uma finalidade');
      return;
    }
    if (currentStep === 2 && !formData.detail) {
      alert('Por favor, selecione um detalhamento');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.usage || !formData.detail || !formData.budget) {
      alert('Por favor, complete todas as etapas');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Enviando para backend:', formData);

      const response = await recommendationService.generateBuild(formData);

      console.log('✅ Resposta do backend:', response);

      // Salvar no context
      setRecommendation(response);
      setQuestionnaireData({
        usage: formData.usage,
        budget: formData.budget,
        detail: formData.detail
      });

      // Redirecionar para página de recomendação
      navigate('/recomendacao');
    } catch (error: any) {
      console.error('❌ Erro ao gerar recomendação:', error);
      console.error('Detalhes do erro:', error.response?.data);

      if (error.response?.status === 404) {
        alert('❌ Nenhuma peça encontrada para essa combinação.\n\n📝 Cadastre peças no painel admin primeiro:\n- CPUs\n- GPUs\n- Placas-mãe\n- Memórias RAM\n- Armazenamentos\n- Fontes\n- Gabinetes\n- Refrigeração');
      } else if (error.response?.status === 500) {
        alert('❌ Erro no servidor ao gerar recomendação.\n\n💡 Possíveis causas:\n- Faltam peças cadastradas\n- Peças incompatíveis (ex: CPU AMD com placa Intel)\n- Erro na lógica de compatibilidade');
      } else if (error.response?.data?.message) {
        alert(`❌ Erro: ${error.response.data.message}`);
      } else {
        alert('❌ Erro ao gerar recomendação.\n\nTente novamente ou cadastre mais peças no admin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Barra de Progresso */}
        <div className={styles.stepper}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''} ${currentStep > 1 ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepLabel}>Finalidade</div>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepLabel}>Detalhamento</div>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepLabel}>Orçamento</div>
          </div>
        </div>

        {/* ETAPA 1: Finalidade */}
        {currentStep === 1 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Qual será o uso principal do PC?</h1>
            <p className={styles.subtitle}>Isso nos ajuda a priorizar as peças certas para sua necessidade</p>

            <div className={styles.optionsGrid}>
              {usageOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.optionCard} ${formData.usage === option.value ? styles.selected : ''}`}
                  onClick={() => handleSelectUsage(option.value)}
                >
                  <div className={styles.optionIcon}>{option.icon}</div>
                  <h3 className={styles.optionTitle}>{option.label}</h3>
                  <p className={styles.optionDescription}>{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ETAPA 2: Detalhamento COM ÍCONES */}
        {currentStep === 2 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Especifique o nível desejado</h1>
            <p className={styles.subtitle}>Escolha o detalhamento que melhor se adequa ao seu uso</p>

            <div className={styles.optionsGrid}>
              {getDetailOptions().map((option) => (
                <div
                  key={option.value}
                  className={`${styles.optionCard} ${formData.detail === option.value ? styles.selected : ''}`}
                  onClick={() => handleSelectDetail(option.value)}
                >
                  <div className={styles.optionIcon}>{option.icon}</div>
                  <h3 className={styles.optionTitle}>{option.label}</h3>
                  <p className={styles.optionDescription}>{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ETAPA 3: Orçamento */}
        {currentStep === 3 && (
          <div className={styles.stepContent}>
            <h1 className={styles.title}>Qual é seu orçamento?</h1>
            <p className={styles.subtitle}>Definiremos as melhores peças dentro da sua faixa de preço</p>

            <div className={styles.optionsGrid}>
              {budgetOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.optionCard} ${formData.budget === option.value ? styles.selected : ''}`}
                  onClick={() => handleSelectBudget(option.value)}
                >
                  <div className={styles.optionIcon} style={{ backgroundColor: `${option.color}20` }}>
                    <span style={{ fontSize: '2.5rem', color: option.color }}>$</span>
                  </div>
                  <h3 className={styles.optionTitle}>{option.label}</h3>
                  <p className={styles.optionDescription}>{option.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões de Navegação */}
        <div className={styles.actions}>
          {currentStep > 1 && (
            <button className={styles.backButton} onClick={handleBack}>
              ← Voltar
            </button>
          )}

          {currentStep < 3 ? (
            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !formData.usage) ||
                (currentStep === 2 && !formData.detail)
              }
            >
              Próximo →
            </button>
          ) : (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!formData.budget || isLoading}
            >
              {isLoading ? 'Gerando recomendação...' : 'Gerar Recomendação'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionario;