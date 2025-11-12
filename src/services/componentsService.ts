import api from './api';
import type {
  CpuModel,
  PlacaMaeModel,
  GpuModel,
  MemoriaRamModel,
  ArmazenamentoModel,
  FonteModel,
  GabineteModel,
  RefrigeracaoModel
} from './recommendationService';

// ===========================
// CPU SERVICE
// ===========================
export const cpuService = {
  async getAll(): Promise<CpuModel[]> {
    const response = await api.get('/api/cpus');
    return response.data;
  },

  async getById(id: number): Promise<CpuModel> {
    const response = await api.get(`/api/cpus/${id}`);
    return response.data;
  },

  async create(data: Omit<CpuModel, 'id'>): Promise<CpuModel> {
    const response = await api.post('/api/cpus', data);
    return response.data;
  },

  async update(id: number, data: Omit<CpuModel, 'id'>): Promise<CpuModel> {
    const response = await api.put(`/api/cpus/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/cpus/${id}`);
  }
};

// ===========================
// GPU SERVICE
// ===========================
export const gpuService = {
  async getAll(): Promise<GpuModel[]> {
    const response = await api.get('/api/gpus');
    return response.data;
  },

  async getById(id: number): Promise<GpuModel> {
    const response = await api.get(`/api/gpus/${id}`);
    return response.data;
  },

  async create(data: Omit<GpuModel, 'id'>): Promise<GpuModel> {
    const response = await api.post('/api/gpus', data);
    return response.data;
  },

  async update(id: number, data: Omit<GpuModel, 'id'>): Promise<GpuModel> {
    const response = await api.put(`/api/gpus/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/gpus/${id}`);
  }
};

// ===========================
// PLACA-MÃE SERVICE
// ===========================
export const placaMaeService = {
  async getAll(): Promise<PlacaMaeModel[]> {
    const response = await api.get('/api/placas-mae');
    return response.data;
  },

  async getById(id: number): Promise<PlacaMaeModel> {
    const response = await api.get(`/api/placas-mae/${id}`);
    return response.data;
  },

  async create(data: Omit<PlacaMaeModel, 'id'>): Promise<PlacaMaeModel> {
    const response = await api.post('/api/placas-mae', data);
    return response.data;
  },

  async update(id: number, data: Omit<PlacaMaeModel, 'id'>): Promise<PlacaMaeModel> {
    const response = await api.put(`/api/placas-mae/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/placas-mae/${id}`);
  }
};

// ===========================
// MEMÓRIA RAM SERVICE
// ===========================
export const memoriaRamService = {
  async getAll(): Promise<MemoriaRamModel[]> {
    const response = await api.get('/api/memorias-ram');
    return response.data;
  },

  async getById(id: number): Promise<MemoriaRamModel> {
    const response = await api.get(`/api/memorias-ram/${id}`);
    return response.data;
  },

  async create(data: Omit<MemoriaRamModel, 'id'>): Promise<MemoriaRamModel> {
    const response = await api.post('/api/memorias-ram', data);
    return response.data;
  },

  async update(id: number, data: Omit<MemoriaRamModel, 'id'>): Promise<MemoriaRamModel> {
    const response = await api.put(`/api/memorias-ram/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/memorias-ram/${id}`);
  }
};

// ===========================
// ARMAZENAMENTO SERVICE
// ===========================
export const armazenamentoService = {
  async getAll(): Promise<ArmazenamentoModel[]> {
    const response = await api.get('/api/armazenamentos');
    return response.data;
  },

  async getById(id: number): Promise<ArmazenamentoModel> {
    const response = await api.get(`/api/armazenamentos/${id}`);
    return response.data;
  },

  async create(data: Omit<ArmazenamentoModel, 'id'>): Promise<ArmazenamentoModel> {
    const response = await api.post('/api/armazenamentos', data);
    return response.data;
  },

  async update(id: number, data: Omit<ArmazenamentoModel, 'id'>): Promise<ArmazenamentoModel> {
    const response = await api.put(`/api/armazenamentos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/armazenamentos/${id}`);
  }
};

// ===========================
// FONTE SERVICE
// ===========================
export const fonteService = {
  async getAll(): Promise<FonteModel[]> {
    const response = await api.get('/api/fontes');
    return response.data;
  },

  async getById(id: number): Promise<FonteModel> {
    const response = await api.get(`/api/fontes/${id}`);
    return response.data;
  },

  async create(data: Omit<FonteModel, 'id'>): Promise<FonteModel> {
    const response = await api.post('/api/fontes', data);
    return response.data;
  },

  async update(id: number, data: Omit<FonteModel, 'id'>): Promise<FonteModel> {
    const response = await api.put(`/api/fontes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/fontes/${id}`);
  }
};

// ===========================
// GABINETE SERVICE
// ===========================
export const gabineteService = {
  async getAll(): Promise<GabineteModel[]> {
    const response = await api.get('/api/gabinetes');
    return response.data;
  },

  async getById(id: number): Promise<GabineteModel> {
    const response = await api.get(`/api/gabinetes/${id}`);
    return response.data;
  },

  async create(data: Omit<GabineteModel, 'id'>): Promise<GabineteModel> {
    const response = await api.post('/api/gabinetes', data);
    return response.data;
  },

  async update(id: number, data: Omit<GabineteModel, 'id'>): Promise<GabineteModel> {
    const response = await api.put(`/api/gabinetes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/gabinetes/${id}`);
  }
};

// ===========================
// REFRIGERAÇÃO SERVICE
// ===========================
export const refrigeracaoService = {
  async getAll(): Promise<RefrigeracaoModel[]> {
    const response = await api.get('/api/refrigeracoes');
    return response.data;
  },

  async getById(id: number): Promise<RefrigeracaoModel> {
    const response = await api.get(`/api/refrigeracoes/${id}`);
    return response.data;
  },

  async create(data: Omit<RefrigeracaoModel, 'id'>): Promise<RefrigeracaoModel> {
    const response = await api.post('/api/refrigeracoes', data);
    return response.data;
  },

  async update(id: number, data: Omit<RefrigeracaoModel, 'id'>): Promise<RefrigeracaoModel> {
    const response = await api.put(`/api/refrigeracoes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/refrigeracoes/${id}`);
  }
};