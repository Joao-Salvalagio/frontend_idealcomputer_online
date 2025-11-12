import api from './api';

// ✅ Interface alinhada com BuildRequestDTO do backend
export interface BuildSaveRequest {
  nome_build: string;
  id_cpu: number;
  id_placamae: number;
  id_gpu: number | null;
  id_ram: number;
  id_armazenamento: number;
  id_fonte: number;
  id_gabinete: number;
  id_refrigeracao: number | null;
  uso_principal: string;
  detalhe: string;
  orcamento: string;
}

// ✅ ComponenteDTO interno (resposta do backend)
export interface ComponenteDTO {
  id: number;
  nome: string;
  marca: string;
  preco: number;
}

// ✅ Interface alinhada com BuildResponseDTO do backend
export interface BuildResponse {
  id: number;
  nomeBuild: string;
  cpu: ComponenteDTO;
  placaMae: ComponenteDTO;
  gpu: ComponenteDTO | null;
  memoriaRam: ComponenteDTO;
  armazenamento: ComponenteDTO;
  fonte: ComponenteDTO;
  gabinete: ComponenteDTO;
  refrigeracao: ComponenteDTO | null;
  usoPrincipal: string;
  detalhe: string;
  orcamento: string;
  precoTotal: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

export const buildService = {
  // ✅ POST /api/builds/save
  async saveBuild(data: BuildSaveRequest): Promise<BuildResponse> {
    const response = await api.post<BuildResponse>('/api/builds/save', data); // ✅ CORRIGIDO
    return response.data;
  },

  // ✅ GET /api/builds/my-builds
  async getMyBuilds(): Promise<BuildResponse[]> {
    const response = await api.get<BuildResponse[]>('/api/builds/my-builds'); // ✅ CORRIGIDO
    return response.data;
  },

  // ✅ GET /api/builds/{id}
  async getBuildById(id: number): Promise<BuildResponse> {
    const response = await api.get<BuildResponse>(`/api/builds/${id}`); // ✅ CORRIGIDO
    return response.data;
  },

  // ✅ DELETE /api/builds/{id}
  async deleteBuild(id: number): Promise<void> {
    await api.delete(`/api/builds/${id}`); // ✅ CORRIGIDO
  }
};
