import api from './api'; // Importa o mock de api

export const authService = {
  login: async (email: string) => {
    // A lógica de login real está no AuthContext para esta versão mockada
    // Aqui apenas simulamos o retorno de um token e dados de usuário
    const mockUsers: { [key: string]: any } = {
      'lider@empresa.com': {
        id: 'lider-123',
        email: 'lider@empresa.com',
        nome: 'João Silva',
        role: 'LIDER',
        supervisao: { id: 'sup-a', nome: 'Supervisão A' },
      },
      'supervisor@empresa.com': {
        id: 'supervisor-456',
        email: 'supervisor@empresa.com',
        nome: 'Maria Santos',
        role: 'SUPERVISOR',
        supervisao: { id: 'sup-a', nome: 'Supervisão A' },
      },
      'gerente@empresa.com': {
        id: 'gerente-789',
        email: 'gerente@empresa.com',
        nome: 'Carlos Oliveira',
        role: 'GERENTE',
      },
      'staff@empresa.com': {
        id: 'staff-012',
        email: 'staff@empresa.com',
        nome: 'Ana Costa',
        role: 'STAFF',
      },
    };

    const user = mockUsers[email];
    if (user) {
      return { access_token: 'mock-jwt-token', user };
    }
    throw new Error('Usuário mockado não encontrado');
  },

  getProfile: async () => {
    // Para a versão mockada, o perfil já está no localStorage
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    throw new Error('Nenhum usuário mockado logado');
  },
};
