import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { armazenamentoService } from '../../services/componentsService';
import type { ArmazenamentoModel } from '../../services/recommendationService';

const ArmazenamentoForm: React.FC = () => {
  const [armazenamentos, setArmazenamentos] = useState<ArmazenamentoModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    tipo: '',
    capacidadeGb: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { loadArmazenamentos(); }, []);

  const loadArmazenamentos = async () => {
    try {
      const data = await armazenamentoService.getAll();
      setArmazenamentos(data);
    } catch (error) {
      console.error('Erro ao carregar Armazenamentos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        await armazenamentoService.update(editingId, formData);
        setMessage('Armazenamento atualizado com sucesso!');
      } else {
        await armazenamentoService.create(formData);
        setMessage('Armazenamento cadastrado com sucesso!');
      }
      resetForm();
      loadArmazenamentos();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar Armazenamento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (armazenamento: ArmazenamentoModel) => {
    setFormData({
      nome: armazenamento.nome,
      marca: armazenamento.marca,
      preco: armazenamento.preco,
      tipo: armazenamento.tipo,
      capacidadeGb: armazenamento.capacidadeGb
    });
    setEditingId(armazenamento.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este Armazenamento?')) return;
    try {
      await armazenamentoService.delete(id);
      setMessage('Armazenamento excluído com sucesso!');
      loadArmazenamentos();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir Armazenamento');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', marca: '', preco: 0, tipo: '', capacidadeGb: 0 });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>💿 Gerenciar Armazenamentos</h2>
      {message && <div className={message.includes('sucesso') ? styles.success : styles.error}>{message}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: 970 EVO Plus" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input type="text" value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value })} placeholder="Ex: Samsung" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Preço (R$)</label>
            <input type="number" step="0.01" value={formData.preco} onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })} placeholder="0.00" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <input type="text" value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} placeholder="Ex: SSD NVMe" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Capacidade (GB)</label>
            <input type="number" value={formData.capacidadeGb} onChange={e => setFormData({ ...formData, capacidadeGb: parseInt(e.target.value) })} placeholder="Ex: 500" required />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Armazenamento' : 'Cadastrar Armazenamento'}
          </button>
          {editingId && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancelar Edição</button>}
        </div>
      </form>
      <div className={styles.list}>
        <h3>Armazenamentos Cadastrados ({armazenamentos.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr><th>Marca</th><th>Nome</th><th>Tipo</th><th>Capacidade</th><th>Preço</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {armazenamentos.map(armazenamento => (
                <tr key={armazenamento.id}>
                  <td>{armazenamento.marca}</td>
                  <td>{armazenamento.nome}</td>
                  <td>{armazenamento.tipo}</td>
                  <td>{armazenamento.capacidadeGb}GB</td>
                  <td>R$ {armazenamento.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(armazenamento)}>✏️ Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(armazenamento.id)}>🗑️ Excluir</button>
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

export default ArmazenamentoForm;
