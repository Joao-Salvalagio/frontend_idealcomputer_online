import React, { useState, useEffect } from 'react';
import styles from './ComponentForm.module.css';
import { gpuService } from '../../services/componentsService';
import type { GpuModel } from '../../services/recommendationService';

const GpuForm: React.FC = () => {
  const [gpus, setGpus] = useState<GpuModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    preco: 0,
    memoriaVram: 0,
    potenciaRecomendadaW: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadGpus();
  }, []);

  const loadGpus = async () => {
    try {
      const data = await gpuService.getAll();
      setGpus(data);
    } catch (error) {
      console.error('Erro ao carregar GPUs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingId) {
        await gpuService.update(editingId, formData);
        setMessage('GPU atualizada com sucesso!');
      } else {
        await gpuService.create(formData);
        setMessage('GPU cadastrada com sucesso!');
      }
      
      resetForm();
      loadGpus();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao salvar GPU');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gpu: GpuModel) => {
    setFormData({
      nome: gpu.nome,
      marca: gpu.marca,
      preco: gpu.preco,
      memoriaVram: gpu.memoriaVram,
      potenciaRecomendadaW: gpu.potenciaRecomendadaW
    });
    setEditingId(gpu.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta GPU?')) return;

    try {
      await gpuService.delete(id);
      setMessage('GPU excluída com sucesso!');
      loadGpus();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Erro ao excluir GPU');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      marca: '',
      preco: 0,
      memoriaVram: 0,
      potenciaRecomendadaW: 0
    });
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h2>🎮 Gerenciar GPUs</h2>

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
              placeholder="Ex: RTX 3060"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Marca</label>
            <input
              type="text"
              value={formData.marca}
              onChange={e => setFormData({ ...formData, marca: e.target.value })}
              placeholder="Ex: NVIDIA"
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
            <label>Memória VRAM (GB)</label>
            <input
              type="number"
              value={formData.memoriaVram}
              onChange={e => setFormData({ ...formData, memoriaVram: parseInt(e.target.value) })}
              placeholder="Ex: 12"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Potência Recomendada (W)</label>
            <input
              type="number"
              value={formData.potenciaRecomendadaW}
              onChange={e => setFormData({ ...formData, potenciaRecomendadaW: parseInt(e.target.value) })}
              placeholder="Ex: 170"
              required
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Salvando...' : editingId ? 'Atualizar GPU' : 'Cadastrar GPU'}
          </button>
          {editingId && (
            <button type="button" className={styles.cancelButton} onClick={resetForm}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <div className={styles.list}>
        <h3>GPUs Cadastradas ({gpus.length})</h3>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Marca</th>
                <th>Nome</th>
                <th>VRAM</th>
                <th>Potência</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {gpus.map(gpu => (
                <tr key={gpu.id}>
                  <td>{gpu.marca}</td>
                  <td>{gpu.nome}</td>
                  <td>{gpu.memoriaVram}GB</td>
                  <td>{gpu.potenciaRecomendadaW}W</td>
                  <td>R$ {gpu.preco.toFixed(2)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEdit(gpu)}>
                      ✏️ Editar
                    </button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(gpu.id)}>
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

export default GpuForm;
