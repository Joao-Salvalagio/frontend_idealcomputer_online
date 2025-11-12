import api from './api';

export interface RecommendationRequest {
  usage: string;      // "Jogos", "Trabalho", "Estudos"
  budget: string;     // "econômico", "intermediário", "alto", "extremo"
  detail: string;     // "Jogos Leves", "Office Básico", etc
}

export interface ComponentModel {
  id: number;
  nome: string;
  marca: string;
  preco: number;
}

export interface CpuModel extends ComponentModel {
  soquete: string;
  potenciaRecomendadaW: number;
}

export interface PlacaMaeModel extends ComponentModel {
  soqueteCpu: string;
  tipoRamSuportado: string;
  formato: string;
}

export interface GpuModel extends ComponentModel {
  memoriaVram: number;
  potenciaRecomendadaW: number;
}

export interface MemoriaRamModel extends ComponentModel {
  capacidadeGb: number;
  tipo: string;
  frequenciaMhz: number;
}

export interface ArmazenamentoModel extends ComponentModel {
  tipo: string;
  capacidadeGb: number;
}

export interface FonteModel extends ComponentModel {
  potenciaWatts: number;
  formato: string;
}

export interface GabineteModel extends ComponentModel {
  formatosPlacaMaeSuportados: string;
}

export interface RefrigeracaoModel extends ComponentModel {
  tipo: string;
  soquetesCpuSuportados: string;
}

export interface RecommendationResponse {
  cpu: CpuModel;
  placaMae: PlacaMaeModel;
  gpu: GpuModel | null;
  memoriaRam: MemoriaRamModel;
  armazenamento: ArmazenamentoModel;
  fonte: FonteModel;
  gabinete: GabineteModel;
  refrigeracao: RefrigeracaoModel | null;
}

export const recommendationService = {
  async generateBuild(data: RecommendationRequest): Promise<RecommendationResponse> {
    // ✅ CORRIGIDO: Adicionado /api no início
    const response = await api.post<RecommendationResponse>('/api/recommendations/generate', data);
    return response.data;
  }
};