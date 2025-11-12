import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { memoriaRamService } from '../../services/componentsService';
import type { MemoriaRamModel } from '../../services/recommendationService';

const MemoriaRamForm: React.FC = () => {
  const [memorias, setMemorias] = useState<MemoriaRamModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    capacidadeGb: 0,
    tipo: '',
    frequenciaMhz: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { loadMemorias(); }, []);

  const loadMemorias = async () => {
    try {
      const data = await memoriaRamService.getAll();
      setMemorias(data);
    } catch (error) {
      console.error('Erro ao carregar Memórias RAM:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        await memoriaRamService.update(editingId, formData);
        setMessage('Memória RAM atualizada com sucesso!');
      } else {
        await memoriaRamService.create(formData);
        setMessage('Memória RAM cadastrada com sucesso!');
      }
      resetForm();
      loadMemorias();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar Memória RAM');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (memoria: MemoriaRamModel) => {
    setFormData({
      nome: memoria.nome,
      marca: memoria.marca,
      preco: memoria.preco,
      capacidadeGb: memoria.capacidadeGb,
      tipo: memoria.tipo,
      frequenciaMhz: memoria.frequenciaMhz
    });
    setEditingId(memoria.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta Memória RAM?')) return;
    try {
      await memoriaRamService.delete(id);
      setMessage('Memória RAM excluída com sucesso!');
      loadMemorias();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir Memória RAM');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', marca: '', preco: 0, capacidadeGb: 0, tipo: '', frequenciaMhz: 0 });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>💾 Gerenciar Memórias RAM</h2>
      {message && <div className={message.includes('sucesso') ? styles.success : styles.error}>{message}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: Vengeance LPX" required />
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
            <label>Capacidade (GB)</label>
            <input type="number" value={formData.capacidadeGb} onChange={e => setFormData({ ...formData, capacidadeGb: parseInt(e.target.value) })} placeholder="Ex: 16" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <input type="text" value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} placeholder="Ex: DDR4" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Frequência (MHz)</label>
            <input type="number" value={formData.frequenciaMhz} onChange={e => setFormData({ ...formData, frequenciaMhz: parseInt(e.target.value) })} placeholder="Ex: 3200" required />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Memória RAM' : 'Cadastrar Memória RAM'}
          </button>
          {editingId && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancelar Edição</button>}
        </div>
      </form>
      <div className={styles.list}>
        <h3>Memórias RAM Cadastradas ({memorias.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr><th>Marca</th><th>Nome</th><th>Capacidade</th><th>Tipo</th><th>Frequência</th><th>Preço</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {memorias.map(memoria => (
                <tr key={memoria.id}>
                  <td>{memoria.marca}</td>
                  <td>{memoria.nome}</td>
                  <td>{memoria.capacidadeGb}GB</td>
                  <td>{memoria.tipo}</td>
                  <td>{memoria.frequenciaMhz}MHz</td>
                  <td>R$ {memoria.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(memoria)}>✏️ Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(memoria.id)}>🗑️ Excluir</button>
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

export default MemoriaRamForm;
