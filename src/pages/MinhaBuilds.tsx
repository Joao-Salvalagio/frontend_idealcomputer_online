import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { buildService, type BuildResponse } from '../services/buildService';
import styles from './MinhasBuilds.module.css';

const MinhasBuilds: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [builds, setBuilds] = useState<BuildResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Carrega as builds do usuário
  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await buildService.getMyBuilds();
        console.log('✅ Builds carregadas:', data);
        setBuilds(data);
      } catch (err: any) {
        console.error('❌ Erro ao carregar builds:', err);
        setError(err.response?.data?.message || 'Erro ao carregar suas builds. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, []);

  // Deleta uma build
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta build?')) {
      return;
    }

    try {
      setDeletingId(id);
      await buildService.deleteBuild(id);
      setBuilds(builds.filter(b => b.id !== id));
      alert('✅ Build deletada com sucesso!');
    } catch (err: any) {
      console.error('❌ Erro ao deletar build:', err);
      alert(err.response?.data?.message || 'Erro ao deletar build. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  // Formata data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Formata preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando suas builds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>🔄 Tentar Novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>💾 Minhas Builds</div>
        <h1>Builds Salvas</h1>
        <p className={styles.subtitle}>
          Logado como: <strong>{user?.name}</strong> ({user?.email})
        </p>
      </div>

      {/* Botão para criar nova build */}
      <div className={styles.actions}>
        <button className={styles.newBuildButton} onClick={() => navigate('/questionario')}>
          ➕ Criar Nova Build
        </button>
      </div>

      {/* Lista de builds */}
      {builds.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2>Nenhuma build salva ainda</h2>
          <p>Crie sua primeira build respondendo o questionário!</p>
          <button className={styles.emptyButton} onClick={() => navigate('/questionario')}>
            🚀 Criar Primeira Build
          </button>
        </div>
      ) : (
        <div className={styles.buildsGrid}>
          {builds.map((build) => (
            <div key={build.id} className={styles.buildCard}>
              {/* Header do card */}
              <div className={styles.cardHeader}>
                <h3>{build.nomeBuild}</h3>
                <span className={styles.buildBadge}>{build.usoPrincipal}</span>
              </div>

              {/* Detalhes */}
              <div className={styles.cardDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>💻 CPU:</span>
                  <span className={styles.detailValue} title={build.cpu.nome}>
                    {build.cpu.nome}
                  </span>
                </div>

                {build.gpu && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>🎮 GPU:</span>
                    <span className={styles.detailValue} title={build.gpu.nome}>
                      {build.gpu.nome}
                    </span>
                  </div>
                )}

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>🧠 RAM:</span>
                  <span className={styles.detailValue} title={build.memoriaRam.nome}>
                    {build.memoriaRam.nome}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>💾 Armazenamento:</span>
                  <span className={styles.detailValue} title={build.armazenamento.nome}>
                    {build.armazenamento.nome}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>⚡ Fonte:</span>
                  <span className={styles.detailValue} title={build.fonte.nome}>
                    {build.fonte.nome}
                  </span>
                </div>
              </div>

              {/* Footer do card */}
              <div className={styles.cardFooter}>
                <div className={styles.priceInfo}>
                  <span className={styles.priceLabel}>Preço Total:</span>
                  <span className={styles.priceValue}>
                    {formatPrice(Number(build.precoTotal))}
                  </span>
                </div>

                <div className={styles.dateInfo}>
                  Criada em: {formatDate(build.dataCriacao)}
                </div>
              </div>

              {/* Ações */}
              <div className={styles.cardActions}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(build.id)}
                  disabled={deletingId === build.id}
                >
                  {deletingId === build.id ? '⏳ Deletando...' : '🗑️ Deletar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinhasBuilds;
