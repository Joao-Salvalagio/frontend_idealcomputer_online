import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecommendation } from '../contexts/RecommendationContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { buildService } from '../services/buildService';
import styles from './DetalhesComponentes.module.css';
import jsPDF from 'jspdf';

const DetalhesComponentes: React.FC = () => {
  const navigate = useNavigate();
  const { recommendation, questionnaireData } = useRecommendation();
  const { isLoggedIn, user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Redireciona se não houver recomendação
  React.useEffect(() => {
    if (!recommendation) {
      console.warn('⚠️ Nenhuma recomendação encontrada. Redirecionando...');
      navigate('/questionario');
    }
  }, [recommendation, navigate]);

  if (!recommendation || !questionnaireData) {
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  // Calcula preço total
  const totalPrice =
    (recommendation.cpu?.preco || 0) +
    (recommendation.placaMae?.preco || 0) +
    (recommendation.gpu?.preco || 0) +
    (recommendation.memoriaRam?.preco || 0) +
    (recommendation.armazenamento?.preco || 0) +
    (recommendation.fonte?.preco || 0) +
    (recommendation.gabinete?.preco || 0) +
    (recommendation.refrigeracao?.preco || 0);

  // Nome da build
  const buildNames: { [key: string]: string } = {
    Jogos: 'Gaming',
    Trabalho: 'Trabalho',
    Estudos: 'Estudos',
  };

  const budgetNames: { [key: string]: string } = {
    econômico: 'Econômica',
    intermediário: 'Intermediária',
    alto: 'Alta Performance',
    extremo: 'Extrema',
  };

  const buildName = `Build ${buildNames[questionnaireData.usage] || questionnaireData.usage} ${budgetNames[questionnaireData.budget] || questionnaireData.budget}`;

  // ✅ Função para salvar build
  const handleSaveBuild = async () => {
    if (!recommendation.cpu || !recommendation.placaMae || !recommendation.memoriaRam || 
        !recommendation.armazenamento || !recommendation.fonte || !recommendation.gabinete) {
      alert('Erro: Componentes obrigatórios estão faltando.');
      return;
    }

    setLoading(true);
    setSaveSuccess(false);

    try {
      await buildService.saveBuild({
        nome_build: buildName,
        id_cpu: recommendation.cpu.id,
        id_placamae: recommendation.placaMae.id,
        id_gpu: recommendation.gpu?.id || null,
        id_ram: recommendation.memoriaRam.id,
        id_armazenamento: recommendation.armazenamento.id,
        id_fonte: recommendation.fonte.id,
        id_gabinete: recommendation.gabinete.id,
        id_refrigeracao: recommendation.refrigeracao?.id || null,
        uso_principal: questionnaireData.usage,
        detalhe: questionnaireData.detail || '',
        orcamento: questionnaireData.budget,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar build:', error);
      alert('Erro ao salvar build. Verifique se você está logado e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Função para exportar PDF (PROFISSIONAL)
  const handleExportPDF = () => {
    setExportingPDF(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      // Header
      pdf.setFillColor(0, 184, 255);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(buildName, pageWidth / 2, 18, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Detalhes Completos da Build', pageWidth / 2, 28, { align: 'center' });
      
      y = 50;

      // Tabela
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Componentes', margin, y);
      y += 10;

      pdf.setFillColor(0, 184, 255);
      pdf.rect(margin, y, contentWidth, 10, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      
      const col1 = margin + 2;
      const col2 = margin + 35;
      const col3 = margin + 95;
      const col4 = margin + 135;
      
      pdf.text('Tipo', col1, y + 7);
      pdf.text('Nome', col2, y + 7);
      pdf.text('Especificações', col3, y + 7);
      pdf.text('Preço', col4, y + 7);
      
      y += 10;

      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      componentes.forEach((comp, index) => {
        const item = comp.item;
        
        if (index % 2 === 0) {
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, y, contentWidth, 10, 'F');
        }
        
        pdf.setFontSize(9);
        
        if (!item) {
          pdf.text(comp.tipo, col1, y + 7);
          pdf.setTextColor(150, 150, 150);
          pdf.text('Não se aplica', col2, y + 7);
          pdf.setTextColor(0, 0, 0);
        } else {
          pdf.setFont('helvetica', 'bold');
          pdf.text(comp.tipo, col1, y + 7);
          
          pdf.setFont('helvetica', 'normal');
          const nomeTruncado = item.nome.length > 25 
            ? item.nome.substring(0, 25) + '...' 
            : item.nome;
          pdf.text(nomeTruncado, col2, y + 7);
          
          const specs = getSpecs(comp.tipo, item);
          const specsTruncado = specs.length > 20 
            ? specs.substring(0, 20) + '...' 
            : specs;
          pdf.text(specsTruncado, col3, y + 7);
          
          pdf.setTextColor(0, 150, 0);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`R$ ${item.preco.toFixed(2)}`, col4, y + 7);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
        }
        
        y += 10;
        
        if (y > pageHeight - 40) {
          pdf.addPage();
          y = margin;
        }
      });

      // Total
      y += 5;
      pdf.setFillColor(0, 184, 255);
      pdf.rect(margin, y, contentWidth, 12, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Preço Total:', col3, y + 8);
      pdf.text(`R$ ${totalPrice.toFixed(2)}`, col4, y + 8);

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Gerado por Ideal Computer em ${new Date().toLocaleDateString('pt-BR')}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      pdf.save(`${buildName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setExportingPDF(false);
    }
  };

  // ✅ Função para pegar especificações
  const getSpecs = (tipo: string, item: any): string => {
    if (!item) return '—';

    switch (tipo) {
      case 'Processador (CPU)':
        return `Soquete: ${item.soquete || '—'}`;
      
      case 'Placa-mãe':
        return `Formato: ${item.formato || '—'}, Soquete: ${item.soqueteCpu || '—'}`;
      
      case 'Placa de Vídeo (GPU)':
        return item.memoriaVram ? `${item.memoriaVram}GB VRAM` : '—';
      
      case 'Memória RAM':
        return `${item.capacidadeGb || '—'}GB ${item.tipo || '—'} @ ${item.frequenciaMhz || '—'}MHz`;
      
      case 'Armazenamento':
        return `${item.capacidadeGb || '—'}GB ${item.tipo || '—'}`;
      
      case 'Fonte':
        return item.potenciaWatts ? `${item.potenciaWatts}W` : '—';
      
      case 'Gabinete':
        return `Suporta: ${item.formatosPlacaMaeSuportados || '—'}`;
      
      case 'Refrigeração':
        return `Tipo: ${item.tipo || '—'}`;
      
      default:
        return '—';
    }
  };

  // Componentes da tabela
  const componentes = [
    { tipo: 'Processador (CPU)', item: recommendation.cpu },
    { tipo: 'Placa-mãe', item: recommendation.placaMae },
    { tipo: 'Placa de Vídeo (GPU)', item: recommendation.gpu },
    { tipo: 'Memória RAM', item: recommendation.memoriaRam },
    { tipo: 'Armazenamento', item: recommendation.armazenamento },
    { tipo: 'Fonte', item: recommendation.fonte },
    { tipo: 'Gabinete', item: recommendation.gabinete },
    { tipo: 'Refrigeração', item: recommendation.refrigeracao },
  ];

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
      {saveSuccess && (
        <div className={styles.successAlert}>
          ✅ Build salva com sucesso!
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.badge}>🖥️ Detalhes Completos da Build</div>
        <h1>{buildName}</h1>
        <p className={styles.subtitle}>Confira todos os componentes, preços e opções</p>
      </div>

      <div className={styles.buildCard}>
        <div className={styles.tableContainer}>
          <table className={styles.componentsTable}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th>Marca</th>
                <th>Especificações</th>
                <th>Preço</th>
              </tr>
            </thead>
            <tbody>
              {componentes.map((comp, index) => {
                const item = comp.item;
                if (!item) {
                  return (
                    <tr key={index} className={styles.emptyRow}>
                      <td>{comp.tipo}</td>
                      <td colSpan={4} className={styles.notApplicable}>
                        Não se aplica
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={index}>
                    <td className={styles.typeCell}>{comp.tipo}</td>
                    <td className={styles.nameCell}>{item.nome}</td>
                    <td>{item.marca}</td>
                    <td className={styles.specsCell}>{getSpecs(comp.tipo, item)}</td>
                    <td className={styles.priceCell}>
                      R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td colSpan={4} className={styles.totalLabel}>
                  Preço Total
                </td>
                <td className={styles.totalPrice}>
                  R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className={styles.actionsSection}>
          <h3>Salvar e Exportar Build</h3>

          {isLoggedIn ? (
            <div className={styles.loggedInActions}>
              <p className={styles.userInfo}>
                Logado como: <strong>{user?.name}</strong> ({user?.email})
              </p>

              <div className={styles.buttonGrid}>
                <button
                  className={styles.saveButton}
                  onClick={handleSaveBuild}
                  disabled={loading}
                >
                  {loading ? '⏳ Salvando...' : '💾 Salvar Build'}
                </button>

                <button 
                  className={styles.exportButton} 
                  onClick={handleExportPDF}
                  disabled={exportingPDF}
                >
                  {exportingPDF ? '⏳ Gerando PDF...' : '📄 Exportar PDF'}
                </button>

                <button
                  className={styles.secondaryButton}
                  onClick={() => navigate('/questionario')}
                >
                  🔄 Refazer Questionário
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.notLoggedIn}>
              <p className={styles.loginPrompt}>
                🔒 Faça login ou registro para usar as funcionalidades de <strong>Salvar</strong> e <strong>Exportar Build</strong>
              </p>

              <div className={styles.buttonGrid}>
                <button className={styles.loginButton} onClick={() => navigate('/login')}>
                  🔑 Fazer Login
                </button>

                <button className={styles.registerButton} onClick={() => navigate('/register')}>
                  ✍️ Criar Conta
                </button>

                <button
                  className={styles.secondaryButton}
                  onClick={() => navigate('/questionario')}
                >
                  🔄 Refazer Questionário
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesComponentes;
