import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { placaMaeService } from '../../services/componentsService';
import type { PlacaMaeModel } from '../../services/recommendationService';

const PlacaMaeForm: React.FC = () => {
  const [placasMae, setPlacasMae] = useState<PlacaMaeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    soqueteCpu: '',
    tipoRamSuportado: '',
    formato: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { loadPlacasMae(); }, []);

  const loadPlacasMae = async () => {
    try {
      const data = await placaMaeService.getAll();
      setPlacasMae(data);
    } catch (error) {
      console.error('Erro ao carregar Placas-mãe:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        await placaMaeService.update(editingId, formData);
        setMessage('Placa-mãe atualizada com sucesso!');
      } else {
        await placaMaeService.create(formData);
        setMessage('Placa-mãe cadastrada com sucesso!');
      }
      resetForm();
      loadPlacasMae();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar Placa-mãe');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (placa: PlacaMaeModel) => {
    setFormData({
      nome: placa.nome,
      marca: placa.marca,
      preco: placa.preco,
      soqueteCpu: placa.soqueteCpu,
      tipoRamSuportado: placa.tipoRamSuportado,
      formato: placa.formato
    });
    setEditingId(placa.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta Placa-mãe?')) return;
    try {
      await placaMaeService.delete(id);
      setMessage('Placa-mãe excluída com sucesso!');
      loadPlacasMae();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir Placa-mãe');
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', marca: '', preco: 0, soqueteCpu: '', tipoRamSuportado: '', formato: '' });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>🔌 Gerenciar Placas-mãe</h2>
      {message && <div className={message.includes('sucesso') ? styles.success : styles.error}>{message}</div>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: B450M-A" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input type="text" value={formData.marca} onChange={e => setFormData({ ...formData, marca: e.target.value })} placeholder="Ex: ASUS" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Preço (R$)</label>
            <input type="number" step="0.01" value={formData.preco} onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })} placeholder="0.00" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Soquete CPU</label>
            <input type="text" value={formData.soqueteCpu} onChange={e => setFormData({ ...formData, soqueteCpu: e.target.value })} placeholder="Ex: AM4" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Tipo RAM Suportado</label>
            <input type="text" value={formData.tipoRamSuportado} onChange={e => setFormData({ ...formData, tipoRamSuportado: e.target.value })} placeholder="Ex: DDR4" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Formato</label>
            <input type="text" value={formData.formato} onChange={e => setFormData({ ...formData, formato: e.target.value })} placeholder="Ex: Micro-ATX" required />
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar Placa-mãe' : 'Cadastrar Placa-mãe'}
          </button>
          {editingId && <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancelar Edição</button>}
        </div>
      </form>
      <div className={styles.list}>
        <h3>Placas-mãe Cadastradas ({placasMae.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr><th>Marca</th><th>Nome</th><th>Soquete</th><th>RAM</th><th>Formato</th><th>Preço</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {placasMae.map(placa => (
                <tr key={placa.id}>
                  <td>{placa.marca}</td>
                  <td>{placa.nome}</td>
                  <td>{placa.soqueteCpu}</td>
                  <td>{placa.tipoRamSuportado}</td>
                  <td>{placa.formato}</td>
                  <td>R$ {placa.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(placa)}>✏️ Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(placa.id)}>🗑️ Excluir</button>
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

export default PlacaMaeForm;
