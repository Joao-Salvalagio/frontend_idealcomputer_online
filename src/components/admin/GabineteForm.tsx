import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { gabineteService } from '../../services/componentsService';
import type { GabineteModel } from '../../services/recommendationService';

const GabineteForm: React.FC = () => {
  const [gabinetes, setGabinetes] = useState<GabineteModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    formatosPlacaMaeSuportados: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { loadGabinetes(); }, []);

  const loadGabinetes = async () => {
    try {
      const data = await gabineteService.getAll();
      setGabinetes(data);
    } catch (error) {
      console.error('Erro ao carregar Gabinetes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        await gabineteService.update(editingId, formData);
        setMessage('Gabinete atualizado com sucesso!');
      } else {
        await gabineteService.create(formData);
        setMessage('Gabinete cadastrado com sucesso!');
      }
      resetForm();
      loadGabinetes();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar Gabinete');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gabinete: GabineteModel) => {
    setFormData({
      nome: gabinete.nome,
      marca: gabinete.marca,
      preco: gabinete.preco,
      formatosPlacaMaeSuportados: gabinete.formatosPlacaMaeSuportados
    });
    setEditingId(gabinete.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este Gabinete?')) return;
    try {
      await gabineteService.delete(id);
      setMessage('Gabinete excluído com sucesso!');
      loadGabinetes();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir Gabinete');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', marca: '', preco: 0, formatosPlacaMaeSuportados: '' });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>📦 Gerenciar Gabinetes</h2>
      {message && <div className={message.includes('sucesso') ? styles.success : styles.error}>{message}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: NZXT H510" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input type="text" value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value })} placeholder="Ex: NZXT" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Preço (R$)</label>
            <input type="number" step="0.01" value={formData.preco} onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })} placeholder="0.00" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Formatos Suportados</label>
            <input type="text" value={formData.formatosPlacaMaeSuportados} onChange={e => setFormData({ ...formData, formatosPlacaMaeSuportados: e.target.value })} placeholder="Ex: ATX, Micro-ATX" required />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Gabinete' : 'Cadastrar Gabinete'}
          </button>
          {editingId && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancelar Edição</button>}
        </div>
      </form>
      <div className={styles.list}>
        <h3>Gabinetes Cadastrados ({gabinetes.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr><th>Marca</th><th>Nome</th><th>Formatos Suportados</th><th>Preço</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {gabinetes.map(gabinete => (
                <tr key={gabinete.id}>
                  <td>{gabinete.marca}</td>
                  <td>{gabinete.nome}</td>
                  <td>{gabinete.formatosPlacaMaeSuportados}</td>
                  <td>R$ {gabinete.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(gabinete)}>✏️ Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(gabinete.id)}>🗑️ Excluir</button>
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

export default GabineteForm;
