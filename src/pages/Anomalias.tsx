import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import { anomaliaService } from '../services/anomaliaService';
import { format } from 'date-fns';

const Anomalias: React.FC = () => {
  const { turnoId } = useParams<{ turnoId: string }>();
  const navigate = useNavigate();
  const [anomalias, setAnomalias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [justificativa, setJustificativa] = useState('');

  useEffect(() => {
    loadAnomalias();
  }, []);

  const loadAnomalias = async () => {
    if (!turnoId) {
      setLoading(false);
      return;
    }

    try {
      const data = await anomaliaService.findByTurno(turnoId);
      setAnomalias(data);
    } catch (err) {
      setError('Erro ao carregar anomalias (mock)');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipo || !descricao) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await anomaliaService.create({
        turnoId: turnoId!,
        tipo,
        descricao,
        justificativa,
      });

      setTipo('');
      setDescricao('');
      setJustificativa('');
      await loadAnomalias();
      alert('Anomalia registrada com sucesso (mock)!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao registrar anomalia (mock)');
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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Anomalias do Turno</Typography>
        <Button variant="outlined" onClick={() => navigate('/home')}>
          Voltar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Registrar Nova Anomalia
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Justificativa"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Registrar Anomalia
          </Button>
        </Box>
      </Paper>

      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Anomalias Registradas
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data/Hora</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Justificativa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {anomalias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhuma anomalia registrada (mock)
                  </TableCell>
                </TableRow>
              ) : (
                anomalias.map((anomalia) => (
                  <TableRow key={anomalia.id}>
                    <TableCell>
                      {format(new Date(anomalia.createdAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{anomalia.tipo}</TableCell>
                    <TableCell>{anomalia.descricao}</TableCell>
                    <TableCell>{anomalia.justificativa || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Anomalias;
