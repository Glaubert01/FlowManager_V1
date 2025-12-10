import api from './api'; // Importa o mock de api
import { format } from 'date-fns';

let mockTurnoAtivo: any = null;

export const turnoService = {
  create: async (supervisaoId: string, observacoes?: string) => {
    if (mockTurnoAtivo && !mockTurnoAtivo.fechado) {
      throw { response: { data: { message: 'Já existe um turno aberto para esta supervisão' } } };
    }
    const newTurno = {
      id: `turno-${Date.now()}`,
      supervisaoId,
      liderId: 'lider-123',
      dataInicio: new Date().toISOString(),
      dataFim: null,
      fechado: false,
      observacoes,
      lider: { nome: 'João Silva' },
      supervisao: { id: supervisaoId, nome: 'Supervisão A' },
      alocacoes: [],
      anomalias: [],
    };
    mockTurnoAtivo = newTurno;
    return newTurno;
  },

  findOne: async (id: string) => {
    if (mockTurnoAtivo && mockTurnoAtivo.id === id) {
      return mockTurnoAtivo;
    }
    throw { response: { data: { message: 'Turno mockado não encontrado' } } };
  },

  fechar: async (id: string) => {
    if (mockTurnoAtivo && mockTurnoAtivo.id === id) {
      mockTurnoAtivo.fechado = true;
      mockTurnoAtivo.dataFim = new Date().toISOString();
      return mockTurnoAtivo;
    }
    throw { response: { data: { message: 'Turno mockado não encontrado ou já fechado' } } };
  },

  findBySupervisao: async (supervisaoId: string, dataInicio?: string, dataFim?: string) => {
    const turnos = [];
    if (mockTurnoAtivo) {
      turnos.push(mockTurnoAtivo);
    }
    // Adicionar alguns turnos fechados mockados para visualização
    turnos.push({
      id: 'turno-fechado-1',
      supervisaoId,
      liderId: 'lider-123',
      dataInicio: new Date(Date.now() - 86400000).toISOString(), // Ontem
      dataFim: new Date(Date.now() - 86400000 + 3600000 * 8).toISOString(), // 8h depois
      fechado: true,
      observacoes: 'Turno de ontem',
      lider: { nome: 'João Silva' },
      supervisao: { id: supervisaoId, nome: 'Supervisão A' },
      alocacoes: [],
      anomalias: [{ id: 'anom-1', tipo: 'Atraso', descricao: 'Trem atrasado' }],
    });
    return turnos;
  },
};
