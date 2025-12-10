import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import HomeLider from './pages/HomeLider';
import DistribuicaoPostos from './pages/DistribuicaoPostos';
import DemandasTurno from './pages/DemandasTurno';
import Anomalias from './pages/Anomalias';
import DashboardSupervisor from './pages/DashboardSupervisor';
import DashboardGerente from './pages/DashboardGerente';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomeLider />} />
            <Route path="/distribuicao-postos/:turnoId" element={<DistribuicaoPostos />} />
            <Route path="/demandas/:turnoId" element={<DemandasTurno />} />
            <Route path="/anomalias/:turnoId" element={<Anomalias />} />
            <Route path="/dashboard-supervisor" element={<DashboardSupervisor />} />
            <Route path="/dashboard-gerente" element={<DashboardGerente />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
