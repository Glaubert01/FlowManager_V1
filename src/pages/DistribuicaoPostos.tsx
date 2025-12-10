import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { postoService } from '../services/postoService';
import { useAuth } from '../contexts/AuthContext';

const DistribuicaoPostos: React.FC = () => {
  const { turnoId } = useParams<{ turnoId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postos, setPostos] = useState<any[]>([]);
  const [alocacoes, setAlocacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matriculaInput, setMatriculaInput] = useState<{ [key: string]: string }>({});
  const [statusInput, setStatusInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.supervisao?.id || !turnoId) {
      setLoading(false);
      return;
    }

    try {
      const [postosData, alocacoesData] = await Promise.all([
        postoService.findBySupervisao(user.supervisao.id),
        postoService.findAlocacoesByTurno(turnoId),
      ]);

      setPostos(postosData);
      setAlocacoes(alocacoesData);
    } catch (err) {
      setError('Erro ao carregar dados (mock)');
    } finally {
      setLoading(false);
    }
  };

  const handleAlocar = async (postoId: string) => {
    const matricula = matriculaInput[postoId];
    const status = statusInput[postoId] || 'NORMAL';

    if (!matricula && status !== 'FALTA') {
      alert('Digite a matrícula do colaborador');
      return;
    }

    try {
      await postoService.createAlocacao(turnoId!, {
        postoId,
        matricula: matricula || undefined,
        statusAlocacao: status,
      });

      await loadData();
      setMatriculaInput({ ...matriculaInput, [postoId]: '' });
      setStatusInput({ ...statusInput, [postoId]: 'NORMAL' });
      alert('Colaborador alocado (mock)!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao alocar colaborador (mock)');
    }
  };

  const getAlocacaoPorPosto = (postoId: string) => {
    return alocacoes.find((a) => a.postoId === postoId);
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
        <Typography variant="h4">Distribuição de Postos</Typography>
        <Button variant="outlined" onClick={() => navigate('/home')}>
          Voltar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Posto</TableCell>
              <TableCell>Matrícula</TableCell>
              <TableCell>Colaborador</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postos.map((posto) => {
              const alocacao = getAlocacaoPorPosto(posto.id);

              return (
                <TableRow key={posto.id}>
                  <TableCell>{posto.nome}</TableCell>
                  <TableCell>
                    {alocacao ? (
                      alocacao.colaborador?.matricula || '-'
                    ) : (
                      <TextField
                        size="small"
                        placeholder="Matrícula"
                        value={matriculaInput[posto.id] || ''}
                        onChange={(e) =>
                          setMatriculaInput({ ...matriculaInput, [posto.id]: e.target.value })
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {alocacao ? alocacao.colaborador?.nome || '-' : '-'}
                  </TableCell>
                  <TableCell>
                    {alocacao ? (
                      alocacao.statusAlocacao
                    ) : (
                      <FormControl size="small" fullWidth>
                        <Select
                          value={statusInput[posto.id] || 'NORMAL'}
                          onChange={(e) =>
                            setStatusInput({ ...statusInput, [posto.id]: e.target.value })
                          }
                        >
                          <MenuItem value="NORMAL">Normal</MenuItem>
                          <MenuItem value="FALTA">Falta</MenuItem>
                          <MenuItem value="HORA_EXTRA">Hora Extra</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell>
                    {!alocacao && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAlocar(posto.id)}
                      >
                        Alocar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DistribuicaoPostos;
