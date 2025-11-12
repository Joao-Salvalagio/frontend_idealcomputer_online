import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { fonteService } from '../../services/componentsService';
import type { FonteModel } from '../../services/recommendationService';

const FonteForm: React.FC = () => {
  const [fontes, setFontes] = useState<FonteModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    potenciaWatts: 0,
    formato: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { loadFontes(); }, []);

  const loadFontes = async () => {
    try {
      const data = await fonteService.getAll();
      setFontes(data);
    } catch (error) {
      console.error('Erro ao carregar Fontes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        await fonteService.update(editingId, formData);
        setMessage('Fonte atualizada com sucesso!');
      } else {
        await fonteService.create(formData);
        setMessage('Fonte cadastrada com sucesso!');
      }
      resetForm();
      loadFontes();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar Fonte');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fonte: FonteModel) => {
    setFormData({
      nome: fonte.nome,
      marca: fonte.marca,
      preco: fonte.preco,
      potenciaWatts: fonte.potenciaWatts,
      formato: fonte.formato
    });
    setEditingId(fonte.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta Fonte?')) return;
    try {
      await fonteService.delete(id);
      setMessage('Fonte excluída com sucesso!');
      loadFontes();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir Fonte');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', marca: '', preco: 0, potenciaWatts: 0, formato: '' });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>⚡ Gerenciar Fontes</h2>
      {message && <div className={message.includes('sucesso') ? styles.success : styles.error}>{message}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: 80 Plus Bronze" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input type="text" value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value })} placeholder="Ex: Corsair" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Preço (R$)</label>
            <input type="number" step="0.01" value={formData.preco} onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })} placeholder="0.00" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Potência (W)</label>
            <input type="number" value={formData.potenciaWatts} onChange={e => setFormData({ ...formData, potenciaWatts: parseInt(e.target.value) })} placeholder="Ex: 600" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Formato</label>
            <input type="text" value={formData.formato} onChange={e => setFormData({ ...formData, formato: e.target.value })} placeholder="Ex: ATX" required />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Fonte' : 'Cadastrar Fonte'}
          </button>
          {editingId && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancelar Edição</button>}
        </div>
      </form>
      <div className={styles.list}>
        <h3>Fontes Cadastradas ({fontes.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr><th>Marca</th><th>Nome</th><th>Potência</th><th>Formato</th><th>Preço</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {fontes.map(fonte => (
                <tr key={fonte.id}>
                  <td>{fonte.marca}</td>
                  <td>{fonte.nome}</td>
                  <td>{fonte.potenciaWatts}W</td>
                  <td>{fonte.formato}</td>
                  <td>R$ {fonte.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(fonte)}>✏️ Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(fonte.id)}>🗑️ Excluir</button>
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

export default FonteForm;
