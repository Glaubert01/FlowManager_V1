import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { PlayArrow, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { turnoService } from '../services/turnoService';

const HomeLider: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [turnoAtivo, setTurnoAtivo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTurnoAtivo();
  }, []);

  const loadTurnoAtivo = async () => {
    if (!user?.supervisao?.id) {
      setLoading(false);
      return;
    }

    try {
      const turnos = await turnoService.findBySupervisao(user.supervisao.id);
      const ativo = turnos.find((t: any) => !t.fechado);
      setTurnoAtivo(ativo);
    } catch (err) {
      console.error('Erro ao carregar turno ativo (mock):', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarTurno = async () => {
    if (!user?.supervisao?.id) {
      setError('Supervisão não definida para o usuário mockado');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const turno = await turnoService.create(user.supervisao.id);
      setTurnoAtivo(turno);
      navigate(`/distribuicao-postos/${turno.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao iniciar turno (mock)');
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
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Bem-vindo, {user?.nome}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Supervisão: {user?.supervisao?.nome || 'Não definida'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {turnoAtivo ? (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Turno Ativo
            </Typography>
            <Typography variant="body1" gutterBottom>
              Iniciado em: {new Date(turnoAtivo.dataInicio).toLocaleString('pt-BR')}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/distribuicao-postos/${turnoAtivo.id}`)}
                >
                  Distribuição de Postos
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/demandas/${turnoAtivo.id}`)}
                >
                  Demandas do Turno
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/anomalias/${turnoAtivo.id}`)}
                >
                  Registrar Anomalias
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={async () => {
                    if (window.confirm('Deseja realmente fechar o turno? Esta ação não pode ser desfeita.')) {
                      try {
                        await turnoService.fechar(turnoAtivo.id);
                        setTurnoAtivo(null);
                        alert('Turno fechado com sucesso (mock)!');
                      } catch (err: any) {
                        alert(err.response?.data?.message || 'Erro ao fechar turno (mock)');
                      }
                    }
                  }}
                >
                  Fechar Turno
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom>
              Nenhum turno ativo
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Clique no botão abaixo para iniciar um novo turno
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={handleIniciarTurno}
              sx={{ mt: 3 }}
              disabled={loading}
            >
              Iniciar Turno
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default HomeLider;
