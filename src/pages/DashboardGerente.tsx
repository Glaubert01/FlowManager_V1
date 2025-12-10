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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { dashboardService } from '../services/dashboardService';

const DashboardGerente: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboardData = await dashboardService.getDashboardGerencia();
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
        Dashboard Gerencial (Mock)
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Geral de Turnos
              </Typography>
              <Typography variant="h4">{data?.totalGeralTurnos || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Geral de Anomalias
              </Typography>
              <Typography variant="h4">{data?.totalGeralAnomalias || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 4 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Estatísticas por Supervisão (Mock)</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supervisão</TableCell>
                <TableCell align="right">Total Turnos</TableCell>
                <TableCell align="right">Turnos Fechados</TableCell>
                <TableCell align="right">Anomalias</TableCell>
                <TableCell align="right">Alocações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.estatisticas?.map((stat: any) => (
                <TableRow key={stat.supervisao}>
                  <TableCell>{stat.supervisao}</TableCell>
                  <TableCell align="right">{stat.totalTurnos}</TableCell>
                  <TableCell align="right">{stat.turnosFechados}</TableCell>
                  <TableCell align="right">{stat.totalAnomalias}</TableCell>
                  <TableCell align="right">{stat.totalAlocacoes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DashboardGerente;
