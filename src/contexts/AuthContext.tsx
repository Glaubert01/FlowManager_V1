import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  supervisao?: {
    id: string;
    nome: string;
  };
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string) => {
    const mockUsers: { [key: string]: User } = {
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

    const foundUser = mockUsers[email];
    if (foundUser) {
      localStorage.setItem('mockUser', JSON.stringify(foundUser));
      setUser(foundUser);
    } else {
      throw new Error('Usuário não encontrado nos mocks.');
    }
  };

  const logout = () => {
    localStorage.removeItem('mockUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
