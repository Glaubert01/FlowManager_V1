import api from './api'; // Importa o mock de api

let mockAnomalias: any[] = [];

export const anomaliaService = {
  create: async (data: any) => {
    const newAnomalia = {
      id: `anomalia-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    mockAnomalias.push(newAnomalia);
    return newAnomalia;
  },

  findByTurno: async (turnoId: string) => {
    return mockAnomalias.filter((a) => a.turnoId === turnoId);
  },
};
