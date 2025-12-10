import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/dashboardService';

const DashboardSupervisor: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    if (!user?.supervisao?.id) {
      setLoading(false);
      return;
    }

    try {
      const dashboardData = await dashboardService.getDashboardSupervisor(user.supervisao.id);
      setData(dashboardData);
    } catch (err) {
      console.error('Erro ao carregar dashboard (mock):', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard - {user?.supervisao?.nome} (Mock)
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Turnos
              </Typography>
              <Typography variant="h4">{data?.totalTurnos || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Turnos Fechados
              </Typography>
              <Typography variant="h4">{data?.turnosFechados || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Anomalias
              </Typography>
              <Typography variant="h4">{data?.totalAnomalias || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Alocações
              </Typography>
              <Typography variant="h4">
                {data?.alocacoesPorStatus?.reduce((acc: number, item: any) => acc + item._count, 0) || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Últimos Turnos (Mock)
        </Typography>
        {data?.turnos?.map((turno: any) => (
          <Box key={turno.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="subtitle1">
              Líder: {turno.lider.nome}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Início: {new Date(turno.dataInicio).toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Status: {turno.fechado ? 'Fechado' : 'Aberto'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Anomalias: {turno.anomalias.length}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default DashboardSupervisor;
