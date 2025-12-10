import api from './api'; // Importa o mock de api

let mockAlocacoes: any[] = [];

export const postoService = {
  findBySupervisao: async (supervisaoId: string) => {
    return [
      { id: 'posto-1', nome: 'Posto 1 - Locomotiva 101', supervisaoId },
      { id: 'posto-2', nome: 'Posto 2 - Locomotiva 102', supervisaoId },
      { id: 'posto-3', nome: 'Posto 3 - Manutenção', supervisaoId },
    ];
  },

  createAlocacao: async (turnoId: string, data: any) => {
    const colaborador = await postoService.buscarColaborador(data.matricula);
    const newAlocacao = {
      id: `alocacao-${Date.now()}`,
      turnoId,
      postoId: data.postoId,
      colaboradorId: colaborador?.id,
      colaborador: colaborador,
      statusAlocacao: data.statusAlocacao,
      observacao: data.observacao,
      posto: { id: data.postoId, nome: `Posto ${data.postoId.split('-')[1]}` },
    };
    mockAlocacoes.push(newAlocacao);
    return newAlocacao;
  },

  findAlocacoesByTurno: async (turnoId: string) => {
    return mockAlocacoes.filter((a) => a.turnoId === turnoId);
  },

  buscarColaborador: async (matricula: string) => {
    const mockColaboradores: { [key: string]: any } = {
      '001': { id: 'colab-001', matricula: '001', nome: 'Pedro Alves', funcao: 'Operador' },
      '002': { id: 'colab-002', matricula: '002', nome: 'Lucas Ferreira', funcao: 'Operador' },
      '003': { id: 'colab-003', matricula: '003', nome: 'Rafael Lima', funcao: 'Mecânico' },
    };
    const colaborador = mockColaboradores[matricula];
    if (colaborador) {
      return colaborador;
    }
    throw { response: { data: { message: 'Colaborador não encontrado' } } };
  },
};
