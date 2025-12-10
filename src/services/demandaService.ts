import api from './api'; // Importa o mock de api
import { format } from 'date-fns';

const mockStatusDemandas = [
  { id: 'status-pendente', codigo: 'PENDENTE', descricao: 'Pendente' },
  { id: 'status-encaminhado', codigo: 'ENCAMINHADO', descricao: 'Encaminhado' },
  { id: 'status-realizado', codigo: 'REALIZADO', descricao: 'Realizado' },
  { id: 'status-nao-realizado', codigo: 'NAO_REALIZADO', descricao: 'Não Realizado' },
];

let mockExames = [
  {
    id: 'exame-1',
    colaborador: { id: 'colab-001', nome: 'Pedro Alves' },
    tipoExame: 'Audiometria',
    dataAgendada: new Date().toISOString(),
    status: mockStatusDemandas[0],
  },
  {
    id: 'exame-2',
    colaborador: { id: 'colab-002', nome: 'Lucas Ferreira' },
    tipoExame: 'Acuidade Visual',
    dataAgendada: new Date().toISOString(),
    status: mockStatusDemandas[0],
  },
];

let mockTreinamentos = [
  {
    id: 'treinamento-1',
    colaborador: { id: 'colab-001', nome: 'Pedro Alves' },
    nomeTreinamento: 'Segurança em Vias Férreas',
    dataAgendada: new Date().toISOString(),
    status: mockStatusDemandas[0],
  },
];

let mockPreventivas = [
  {
    id: 'preventiva-1',
    locomotiva: { id: 'loc-101', numero: 'LOC-101' },
    tipoPreventiva: 'Troca de Óleo',
    dataAgendada: new Date().toISOString(),
    status: mockStatusDemandas[0],
  },
];

export const demandaService = {
  getStatusDemandas: async () => {
    return mockStatusDemandas;
  },

  findExames: async (data: string, supervisaoId?: string) => {
    return mockExames;
  },

  updateStatusExame: async (id: string, statusCodigo: string, observacao?: string) => {
    const exameIndex = mockExames.findIndex((e) => e.id === id);
    if (exameIndex > -1) {
      const status = mockStatusDemandas.find((s) => s.codigo === statusCodigo);
      if (status) {
        mockExames[exameIndex].status = status;
        // mockExames[exameIndex].observacao = observacao; // Adicionar se o mock tiver observacao
        return mockExames[exameIndex];
      }
    }
    throw { response: { data: { message: 'Exame mockado não encontrado ou status inválido' } } };
  },

  findTreinamentos: async (data: string, supervisaoId?: string) => {
    return mockTreinamentos;
  },

  updateStatusTreinamento: async (id: string, statusCodigo: string, observacao?: string) => {
    const treinamentoIndex = mockTreinamentos.findIndex((t) => t.id === id);
    if (treinamentoIndex > -1) {
      const status = mockStatusDemandas.find((s) => s.codigo === statusCodigo);
      if (status) {
        mockTreinamentos[treinamentoIndex].status = status;
        return mockTreinamentos[treinamentoIndex];
      }
    }
    throw { response: { data: { message: 'Treinamento mockado não encontrado ou status inválido' } } };
  },

  findPreventivas: async (data: string) => {
    return mockPreventivas;
  },

  updateStatusPreventiva: async (id: string, statusCodigo: string, observacao?: string) => {
    const preventivaIndex = mockPreventivas.findIndex((p) => p.id === id);
    if (preventivaIndex > -1) {
      const status = mockStatusDemandas.find((s) => s.codigo === statusCodigo);
      if (status) {
        mockPreventivas[preventivaIndex].status = status;
        return mockPreventivas[preventivaIndex];
      }
    }
    throw { response: { data: { message: 'Preventiva mockada não encontrada ou status inválido' } } };
  },
};
