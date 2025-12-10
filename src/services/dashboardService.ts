import api from './api'; // Importa o mock de api

export const dashboardService = {
  getDashboardSupervisor: async (supervisaoId: string, dataInicio?: string, dataFim?: string) => {
    return {
      totalTurnos: 5,
      turnosFechados: 4,
      totalAnomalias: 2,
      alocacoesPorStatus: [
        { statusAlocacao: 'NORMAL', _count: 10 },
        { statusAlocacao: 'FALTA', _count: 1 },
        { statusAlocacao: 'HORA_EXTRA', _count: 2 },
      ],
      turnos: [
        {
          id: 'turno-fechado-1',
          lider: { nome: 'João Silva' },
          dataInicio: new Date(Date.now() - 86400000).toISOString(),
          fechado: true,
          anomalias: [{ id: 'anom-1', tipo: 'Atraso' }],
        },
        {
          id: 'turno-fechado-2',
          lider: { nome: 'Maria Santos' },
          dataInicio: new Date(Date.now() - 86400000 * 2).toISOString(),
          fechado: true,
          anomalias: [],
        },
      ],
    };
  },

  getDashboardGerencia: async (dataInicio?: string, dataFim?: string) => {
    return {
      totalGeralTurnos: 15,
      totalGeralAnomalias: 5,
      estatisticas: [
        {
          supervisao: 'Supervisão A',
          totalTurnos: 8,
          turnosFechados: 7,
          totalAnomalias: 3,
          totalAlocacoes: 25,
        },
        {
          supervisao: 'Supervisão B',
          totalTurnos: 7,
          turnosFechados: 6,
          totalAnomalias: 2,
          totalAlocacoes: 20,
        },
      ],
    };
  },
};
