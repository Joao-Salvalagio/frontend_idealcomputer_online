import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { refrigeracaoService } from '../../services/componentsService';
import type { RefrigeracaoModel } from '../../services/recommendationService';

const RefrigeracaoForm: React.FC = () => {
  const [refrigeracoes, setRefrigeracoes] = useState<RefrigeracaoModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    tipo: '',
    soquetesCpuSuportados: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { loadRefrigeracoes(); }, []);

  const loadRefrigeracoes = async () => {
    try {
      const data = await refrigeracaoService.getAll();
      setRefrigeracoes(data);
    } catch (error) {
      console.error('Erro ao carregar Refrigerações:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        await refrigeracaoService.update(editingId, formData);
        setMessage('Refrigeração atualizada com sucesso!');
      } else {
        await refrigeracaoService.create(formData);
        setMessage('Refrigeração cadastrada com sucesso!');
      }
      resetForm();
      loadRefrigeracoes();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar Refrigeração');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (refrigeracao: RefrigeracaoModel) => {
    setFormData({
      nome: refrigeracao.nome,
      marca: refrigeracao.marca,
      preco: refrigeracao.preco,
      tipo: refrigeracao.tipo,
      soquetesCpuSuportados: refrigeracao.soquetesCpuSuportados
    });
    setEditingId(refrigeracao.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta Refrigeração?')) return;
    try {
      await refrigeracaoService.delete(id);
      setMessage('Refrigeração excluída com sucesso!');
      loadRefrigeracoes();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir Refrigeração');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', marca: '', preco: 0, tipo: '', soquetesCpuSuportados: '' });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>❄️ Gerenciar Refrigerações</h2>
      {message && <div className={message.includes('sucesso') ? styles.success : styles.error}>{message}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: Hyper 212" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input type="text" value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value })} placeholder="Ex: Cooler Master" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Preço (R$)</label>
            <input type="number" step="0.01" value={formData.preco} onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })} placeholder="0.00" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <input type="text" value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} placeholder="Ex: Air Cooler" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Soquetes Suportados</label>
            <input type="text" value={formData.soquetesCpuSuportados} onChange={e => setFormData({ ...formData, soquetesCpuSuportados: e.target.value })} placeholder="Ex: AM4, LGA1200" required />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Refrigeração' : 'Cadastrar Refrigeração'}
          </button>
          {editingId && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancelar Edição</button>}
        </div>
      </form>
      <div className={styles.list}>
        <h3>Refrigerações Cadastradas ({refrigeracoes.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr><th>Marca</th><th>Nome</th><th>Tipo</th><th>Soquetes</th><th>Preço</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {refrigeracoes.map(refrigeracao => (
                <tr key={refrigeracao.id}>
                  <td>{refrigeracao.marca}</td>
                  <td>{refrigeracao.nome}</td>
                  <td>{refrigeracao.tipo}</td>
                  <td>{refrigeracao.soquetesCpuSuportados}</td>
                  <td>R$ {refrigeracao.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(refrigeracao)}>✏️ Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(refrigeracao.id)}>🗑️ Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RefrigeracaoForm;
