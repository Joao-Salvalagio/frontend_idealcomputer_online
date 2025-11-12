import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { cpuService } from '../../services/componentsService';
import type { CpuModel } from '../../services/recommendationService';

const CpuForm: React.FC = () => {
  const [cpus, setCpus] = useState<CpuModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    soquete: '',
    potenciaRecomendadaW: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCpus();
  }, []);

  const loadCpus = async () => {
    try {
      const data = await cpuService.getAll();
      setCpus(data);
    } catch (error) {
      console.error('Erro ao carregar CPUs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingId) {
        await cpuService.update(editingId, formData);
        setMessage('CPU atualizada com sucesso!');
      } else {
        await cpuService.create(formData);
        setMessage('CPU cadastrada com sucesso!');
      }
      
      resetForm();
      loadCpus();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar CPU');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cpu: CpuModel) => {
    setFormData({
      nome: cpu.nome,
      marca: cpu.marca,
      preco: cpu.preco,
      soquete: cpu.soquete,
      potenciaRecomendadaW: cpu.potenciaRecomendadaW
    });
    setEditingId(cpu.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta CPU?')) return;

    try {
      await cpuService.delete(id);
      setMessage('CPU excluída com sucesso!');
      loadCpus();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir CPU');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      marca: '',
      preco: 0,
      soquete: '',
      potenciaRecomendadaW: 0
    });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>🔧 Gerenciar CPUs</h2>

      {message && (
        <div className={message.includes('sucesso') ? styles.success : styles.error}>
          {message}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Ryzen 5 5600G"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input
              type="text"
              value={formData.marca}
              onChange={e => setFormData({ ...formData, marca: e.target.value })}
              placeholder="Ex: AMD"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={e => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
              placeholder="0.00"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Soquete</label>
            <input
              type="text"
              value={formData.soquete}
              onChange={e => setFormData({ ...formData, soquete: e.target.value })}
              placeholder="Ex: AM4"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Potência Recomendada (W)</label>
            <input
              type="number"
              value={formData.potenciaRecomendadaW}
              onChange={e => setFormData({ ...formData, potenciaRecomendadaW: parseInt(e.target.value) })}
              placeholder="Ex: 65"
              required
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar CPU' : 'Cadastrar CPU'}
          </button>
          {editingId && (
            <button type="button" className={styles.cancelButton} onClick={resetForm}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        <h3>CPUs Cadastradas ({cpus.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Marca</th>
                <th>Nome</th>
                <th>Soquete</th>
                <th>Potência</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cpus.map(cpu => (
                <tr key={cpu.id}>
                  <td>{cpu.marca}</td>
                  <td>{cpu.nome}</td>
                  <td>{cpu.soquete}</td>
                  <td>{cpu.potenciaRecomendadaW}W</td>
                  <td>R$ {cpu.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(cpu)}>
                      ✏️ Editar
                    </button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(cpu.id)}>
                      🗑️ Excluir
                    </button>
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

export default CpuForm;
